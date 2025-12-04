import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import SubCollection from '../models/subCollection.model.js';
import API_Filters from '../Utills/apiFilters.js';
import { deleteImage, uploadImage } from '../Utills/cloudinary.js';
import ErrorHandler from '../Utills/customErrorHandler.js';

// calculate discounted price
const calculateDiscountedPrice = (product) => {
	return product.price && product.discount
		? product.price - (product.price * product.discount) / 100
		: product.price || 0;
};

const populateProductFields = (query) => {
	return query
		.populate('product_category', 'name')
		.populate('product_collection', 'name')
		.populate('product_skill_level', 'name')
		.populate('product_designer', 'name')
		.populate('product_color', 'name');
};

const addDiscountedPrice = (products) => {
	return products.map((product) => ({
		...product.toObject(),
		discounted_price: calculateDiscountedPrice(product),
	}));
};

const MinifigPartType = {
	HAIR: 'HAIR',
	HEAD: 'HEAD',
	TORSO: 'TORSO',
	LEGS: 'LEGS',
	ACCESSORY: 'ACCESSORY',
};

const MINIFIG_PART_TYPE_MAPPING = {
	[MinifigPartType.HAIR]: 'Minifigure Hair',
	[MinifigPartType.HEAD]: 'Minifigure Heads',
	[MinifigPartType.TORSO]: 'Minifigure Torsos',
	[MinifigPartType.LEGS]: 'Minifigure Legs',
	[MinifigPartType.ACCESSORY]: 'Minifigure Accessories',
};

// Helper function to validate and map part types
const mapPartTypesToSubCollections = (partTypeString) => {
	const partTypes = partTypeString.split(',');
	const validPartTypes = Object.values(MinifigPartType);

	const subCollectionNames = partTypes
		.filter((type) => validPartTypes.includes(type))
		.map((type) => MINIFIG_PART_TYPE_MAPPING[type])
		.filter(Boolean);

	return subCollectionNames;
};

//------------------------------------  GET ALL PRODUCT => GET /products  ------------------------------------

export const getProduct = catchAsyncErrors(async (req, res, next) => {
	// Handle specific product IDs request
	if (req.query.ids) {
		const productIds = req.query.ids.split(',');
		const products = await populateProductFields(
			Product.find({ _id: { $in: productIds } })
		);

		return res.status(200).json({
			message: `${products.length} Products retrieved successfully`,
			products: addDiscountedPrice(products),
		});
	}

	// Enhanced search logic for the keyword parameter
	if (req.query.keyword) {
		const keyword = req.query.keyword.trim();

		// For exact phrase matching
		const exactPhrase = {
			product_name: { $regex: `\\b${keyword}\\b`, $options: 'i' },
		};

		// For multi-word search with weighted relevance
		const words = keyword.split(/\s+/).filter((word) => word.length > 2);
		const wordQueries = words.map((word) => ({
			product_name: { $regex: `\\b${word}\\b`, $options: 'i' },
		}));

		// Find products that match the exact phrase or most of the keywords
		let query;
		if (words.length > 1) {
			// For multi-word searches, prioritize exact matches and then partial matches
			query = {
				$or: [
					exactPhrase,
					// Match if most words appear in the product name (more than half)
					{ $and: wordQueries.slice(0, Math.ceil(words.length / 2)) },
				],
			};
		} else {
			// For single word/phrase searches, just use the exact match
			query = exactPhrase;
		}

		// Apply the enhanced search query
		const apiFilters = new API_Filters(Product, {
			...req.query,
			customQuery: query,
		})
			.search()
			.filters();

		// Rest of the pagination and response logic
		const allFilteredProducts = await populateProductFields(
			apiFilters.query.clone()
		);
		const filteredProductCount = allFilteredProducts.length;

		// Original code for regular filtering without keyword search
		const resPerPage = 9;
		const currentPage = Number(req.query.page) || 1;
		apiFilters.pagination(resPerPage);
		const paginatedProducts = await populateProductFields(
			apiFilters.query.clone()
		);

		return res.status(200).json({
			resPerPage,
			currentPage,
			totalPages: Math.ceil(filteredProductCount / resPerPage),
			filteredProductCount,
			message: `${filteredProductCount} Products retrieved successfully`,
			products: addDiscountedPrice(paginatedProducts),
			allProducts: addDiscountedPrice(allFilteredProducts),
		});
	}

	// Original code for regular filtering without keyword search
	const resPerPage = 9;
	const currentPage = Number(req.query.page) || 1;

	if (
		req.query.minifig_part_type &&
		typeof req.query.minifig_part_type === 'string'
	) {
		const subCollectionNames = mapPartTypesToSubCollections(
			req.query.minifig_part_type
		);

		if (subCollectionNames.length > 0) {
			const subCollections = await SubCollection.find(
				{ name: { $in: subCollectionNames } },
				'_id'
			);
			const subCollectionIds = subCollections.map((sc) => sc._id);

			req.query.product_sub_collections = { $in: subCollectionIds };
		}

		delete req.query.minifig_part_type;
	}

	const apiFilters = new API_Filters(Product, req.query).search().filters();

	const allFilteredProducts = await populateProductFields(
		apiFilters.query.clone()
	);
	const filteredProductCount = allFilteredProducts.length;

	apiFilters.pagination(resPerPage);
	const paginatedProducts = await populateProductFields(
		apiFilters.query.clone()
	);

	res.status(200).json({
		resPerPage,
		currentPage,
		totalPages: Math.ceil(filteredProductCount / resPerPage),
		filteredProductCount,
		message: `${filteredProductCount} Products retrieved successfully`,
		products: addDiscountedPrice(paginatedProducts),
		allProducts: addDiscountedPrice(allFilteredProducts),
	});
});

//------------------------------------  GET BEST SELLER PRODUCTS  => GET /products/best-seller  ------------------------------------

export const getBestSellerProduct = catchAsyncErrors(async (req, res, next) => {
	const bestSellerCategory = await Category.findOne({ key: 'best_seller' });

	if (!bestSellerCategory) {
		return res.status(404).json({
			status: false,
			message: 'Best Seller category not found.',
		});
	}

	// Fetch Products under the Best Seller Category
	const bestSellerProducts = await Product.find({
		product_category: bestSellerCategory._id,
	}).sort({ createdAt: -1 });

	if (!bestSellerProducts || bestSellerProducts.length === 0) {
		return res.status(404).json({
			status: false,
			message: 'No products found under the Best Seller category.',
		});
	}
	// .populate("product_category");
	res.status(200).json({
		status: true,
		message: `${bestSellerProducts.length} Products retrieved successfully`,
		products: bestSellerProducts,
	});
});

//------------------------------------  GET A PRODUCT BY ID  => GET /products/:id  ------------------------------------

export const getProductById = catchAsyncErrors(async (req, res, next) => {
	const product = await populateProductFields(Product.findById(req.params.id))
		.populate('product_sub_categories', 'name category')
		.populate('product_sub_collections', 'name collection')
		.populate('product_color', 'name code');

	if (!product) {
		return next(new ErrorHandler('Product not found', 400));
	}

	// Find similar products
	const baseProductName = product.product_name.split(/[\(\-]/)[0].trim();
	const escapedProductName = baseProductName.replace(
		/[.*+?^${}()|[\]\\]/g,
		'\\$&'
	);

	const similarProducts = await populateProductFields(
		Product.find({
			product_name: { $regex: escapedProductName, $options: 'i' },
			partID: product.partID,
			_id: { $ne: product._id },
		})
	).populate('product_color', 'name code');

	res.status(200).json({
		message: 'Product Retrieved Successfully',
		product: {
			...product.toObject(),
			discounted_price: calculateDiscountedPrice(product),
		},
		similarProducts: addDiscountedPrice(similarProducts),
	});
});

// ---------------------------------------------------------------------  ADMIN ----------------------------------------------------------------

//------------------------------------  CREATE NEW PRODUCT BY ADMIN => POST  /admin/newProduct  ------------------------------------

export const newProduct = catchAsyncErrors(async (req, res, next) => {
	console.log('Product : ', req.body);

	const product = await Product.create(req.body);

	if (!product) {
		return next(new ErrorHandler('Failed to create product', 400));
	}

	res.status(201).json({
		message: 'Product created successfully',
		product,
	});
});

//------------------------------------  UPDATE A PRODUCT BY ADMIN => PUT /admin/product/:id  ------------------------------------

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
	const updatedProduct = await Product.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);

	if (!updatedProduct) {
		return next(new ErrorHandler('Product not found', 404));
	}

	res.status(200).json({
		message: 'Product updated successfully',
		updatedProduct,
	});
});

//------------------------------------  DELETE A PRODUCT BY ID  DELETE  => /admin/product/:id  ------------------------------------

export const deleteProductByID = catchAsyncErrors(async (req, res, next) => {
	const deletedProduct = await Product.findByIdAndDelete(req.params.id);

	if (!deletedProduct) {
		return next(new ErrorHandler('Product Not Found', 404));
	}

	res.status(200).json({
		message: 'Product deleted successfully',
		deletedProduct,
	});
});

//------------------------------------  DELETE ALL PRODUCTS  => /admin/product  ------------------------------------

export const deleteAllProducts = catchAsyncErrors(async (req, res, next) => {
	const deletedProducts = await Product.deleteMany();
	if (!deletedProducts) {
		return next(new ErrorHandler("Products can't be deleted", 400));
	}
	res.status(200).json({
		message: 'All Products Deleted Successfully',
	});
});

// ------------------------------- UPLOAD PRODUCT IMAGE  ------------------------------------

export const uploadProductImage = catchAsyncErrors(async (req, res, next) => {
	const { usage = 'MAIN_SITE' } = req.body; // default

	const urls = await Promise.all(
		req.body.images.map((image) =>
			uploadImage(image, 'world_of_minifigs/products')
		)
	);

	const imagesWithUsage = urls.map((url) => ({
		...url,
		usage,
	}));

	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{ $push: { product_images: { $each: imagesWithUsage } } },
		{ new: true, runValidators: true }
	);

	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	res.status(200).json({
		success: true,
		message: 'Images uploaded successfully',
		data: product,
	});
});

// ------------------------------- DELETE PRODUCT IMAGES ---------------------------------------

export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
	const { id } = req.params;
	const { public_id } = req.body;

	if (!public_id) {
		return next(new ErrorHandler('Image ID is required', 400));
	}

	// Check if the product exists
	const product = await Product.findById(id);
	if (!product) {
		return next(new ErrorHandler('Product not found', 404));
	}

	// Delete image from storage
	const isDeleted = await deleteImage(public_id);

	if (!isDeleted) {
		return next(
			new ErrorHandler('Failed to delete image from storage', 500)
		);
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		id,
		{ $pull: { product_images: { public_id } } }, // Remove the image with matching `public_id`
		{ new: true, runValidators: true }
	);

	if (!updatedProduct) {
		return next(new ErrorHandler('Failed to update product images', 500));
	}

	return res.status(200).json({
		success: true,
		message: 'Image deleted successfully',
		product: updatedProduct,
	});
});

// ------------------------------- UPDATE IMAGE USAGE FLAG (is_minifig_builder) -------------------------------

export const updateProductImageMinifigFlag = catchAsyncErrors(
	async (req, res, next) => {
		const { id } = req.params;
		const { public_id, is_minifig_builder } = req.body;

		// Validate
		if (!public_id) {
			return next(new ErrorHandler('public_id is required', 400));
		}

		if (typeof is_minifig_builder !== 'boolean') {
			return next(
				new ErrorHandler('is_minifig_builder must be a boolean', 400)
			);
		}

		// Fetch product
		const product = await Product.findById(id);
		if (!product) {
			return next(new ErrorHandler('Product not found', 404));
		}

		// Find image
		const image = product.product_images.find(
			(img) => img.public_id === public_id
		);
		if (!image) {
			return next(new ErrorHandler('Image not found', 404));
		}

		// Update only the checkbox value
		image.is_minifig_builder = is_minifig_builder;

		await product.save({ validateBeforeSave: true });

		return res.status(200).json({
			success: true,
			message: 'Image status updated for Minifig Builder',
			product,
		});
	}
);
