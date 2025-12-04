import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		product_name: {
			type: String,
			required: [true, 'Please enter product name'],
			maxLength: [200, 'Product name cannot be more than 200 characters'],
			trim: true,
		},
		key: {
			type: String,
			unique: true,
			trim: true,
		},
		partID: {
			type: String,
			required: [true, 'Please enter part ID'],
		},
		itemID: {
			required: [true, 'Please enter item ID'],
			type: String,
			unique: true,
		},
		price: {
			type: Number,
			required: [true, 'Please enter product price'],
			min: [0, 'Price cannot be negative'],
			validate: {
				validator: (v) => /^\d+(\.\d{1,2})?$/.test(v),
				message: 'Price must have at most 2 decimal places',
			},
		},
		discount: {
			type: Number,
			min: [0, 'Discount cannot be negative'],
			max: [100, 'Discount cannot be more than 100%'],
		},
		product_description_1: {
			type: String,
			required: [true, 'Please enter product description'],
		},
		product_description_2: String,
		product_description_3: String,
		product_images: [
			{
				public_id: { type: String },
				url: {
					type: String,
					match: [
						/^https?:\/\/[^\s$.?#].[^\s]*$/,
						'Invalid image URL',
					],
				},
				is_minifig_builder: {
					type: Boolean,
					default: false, // ← new field
				},
				usage: {
					type: String,
					enum: ['MAIN_SITE', 'MINIFIG_BUILDER', 'BOTH'],
					default: 'MAIN_SITE',
				},
			},
		],
		product_category: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Category',
				required: true,
			},
		],
		product_sub_categories: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'SubCategory',
				required: true,
			},
		],
		product_collection: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Collection',
				required: true,
			},
		],
		product_sub_collections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'SubCollection',
				required: true,
			},
		],
		product_piece_count: {
			type: Number,
			required: false,
		},
		product_availability: Date,
		product_length: {
			type: Number,
			required: false,
			validate: {
				validator: (v) => /^\d+(\.\d{1,2})?$/.test(v),
				message: 'Length must have at most 2 decimal places',
			},
		},
		product_width: {
			type: Number,
			required: false,
			validate: {
				validator: (v) => /^\d+(\.\d{1,2})?$/.test(v),
				message: 'Width must have at most 2 decimal places',
			},
		},
		product_height: {
			type: Number,
			required: false,
			validate: {
				validator: (v) => /^\d+(\.\d{1,2})?$/.test(v),
				message: 'Height must have at most 2 decimal places',
			},
		},
		product_includes: {
			type: String,
			required: false,
		},
		product_skill_level: {
			required: false,
			type: mongoose.Schema.Types.ObjectId,
			ref: 'SkillLevel',
		},
		product_designer: {
			required: false,
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Designer',
		},
		ratings: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		seller: String,
		tags: {
			type: [String],
			validate: {
				validator: function (tags) {
					return tags.length <= 10;
				},
				message: 'Only 10 tags are allowed',
			},
		},
		stock: {
			type: Number,
			required: [
				true,
				'Please enter how many items are available in stock',
			],
			min: [0, 'Stock cannot be negative'],
			default: 1,
		},
		reviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Review',
			},
		],
		is_active: {
			type: Boolean,
			default: true,
		},
		manufacturer: String,
		is_preorder: {
			type: Boolean,
			default: false,
		},
		preorder_availability_date: {
			type: Date,
			required: function () {
				return this.is_preorder;
			},
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [false, 'Only Employees or Admins can create products'],
			immutable: true,
		},
		updatedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [false, 'Only Employee or Admin can update products'],
		},
		product_color: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Color',
			required: [true, 'Please specify the product color'],
		},
		minifig_part_type: {
			type: String,
			enum: ['HAIR', 'HEAD', 'TORSO', 'LEGS', 'ACCESSORY'],
			required: false,
			default: null,
		},
	},
	{ timestamps: true }
);

// Add these indexes to improve query performance
productSchema.index({ product_category: 1 });
productSchema.index({ product_sub_categories: 1 });
productSchema.index({ product_collection: 1 });
productSchema.index({ product_sub_collections: 1 });

// Add population configuration
productSchema.pre(/^find/, function (next) {
	this.populate([
		{
			path: 'product_category',
			select: 'name key',
		},
		{
			path: 'product_sub_categories',
			select: 'name key category',
			populate: {
				path: 'category',
				select: 'name key',
			},
		},
		{
			path: 'product_collection',
			select: 'name key',
		},
		{
			path: 'product_sub_collections',
			select: 'name key collection',
			populate: {
				path: 'collection',
				select: 'name key',
			},
		},
	]);
	next();
});

// Optimize the existing pre-save hook
productSchema.pre('save', async function (next) {
	// Only generate key if name and color are present and key doesn't exist
	if (this.product_name && this.product_color && !this.key) {
		this.product_name = this.product_name.trim();
		this.key = `${this.product_name
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '_')}_${this.product_color.toString()}`;

		// ---------------------------------- CHECK FOR UNIQUE KEY CONSTRAINT -----------------------------------------------
		const existingProduct = await mongoose
			.model('Product')
			.findOne({ key: this.key })
			.select('_id');

		if (existingProduct) {
			return next(
				new Error(
					'A product with this name and color combination already exists.'
				)
			);
		}
	}
	next();
});

// -------------------------------------- PRE-UPDATE HOOK TO CHECK FOR UNIQUE KEY DURING UPDATE ---------------------------------------------------------

productSchema.pre('findOneAndUpdate', async function (next) {
	const update = this.getUpdate();
	if (update.product_name || update.product_color) {
		const doc = await this.model
			.findOne(this.getQuery())
			.select('product_name product_color');

		const productName = update.product_name
			? update.product_name.trim()
			: doc.product_name;
		const productColor = update.product_color
			? update.product_color
			: doc.product_color;

		update.key = `${productName
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '_')}_${productColor.toString()}`;

		// Check unique key only when necessary
		const existingProduct = await this.model
			.findOne({
				key: update.key,
				_id: { $ne: this.getQuery()._id },
			})
			.select('_id');

		if (existingProduct) {
			return next(new Error('Product key must be unique.'));
		}
	}
	next();
});

// ---------------------------------- EXPORT PRODUCT MODEL -------------------------------------------------

const Product = mongoose.model('Product', productSchema);

export default Product;
