import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
	reducerPath: 'productApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api/v1',
	}),
	endpoints: (builder) => ({
		// --------------------------------- GET PRODUCTS ---------------------------------------

		getProducts: builder.query({
			query: () => `/products`,
			providesTags: (result) =>
				result
					? [
							...result.products.map(({ _id }) => ({
								type: 'Product',
								id: _id,
							})),
							{ type: 'Products', id: 'LIST' },
					  ]
					: [{ type: 'Products', id: 'LIST' }],
		}),

		// GET PRODUCT DETAILS

		getProductDetails: builder.query({
			query: (id) => `/products/${id}`,
			providesTags: (result, error, id) => [
				{ type: 'ProductDetails', id },
				{ type: 'Product', id },
			],
		}),

		// ADD A NEW PRODUCT

		createProduct: builder.mutation({
			query: (newProduct) => ({
				url: `/admin/newProduct`,
				method: 'POST',
				body: newProduct,
			}),
			invalidatesTags: ['Products'],
		}),

		// UPDATE A PRODUCT

		updateProduct: builder.mutation({
			query: ({ id, productData }) => ({
				url: `/admin/product/${id}`,
				method: 'PUT',
				body: productData,
			}),
			invalidatesTags: (result, error, { id }) => [
				'Products',
				{ type: 'Product', id },
				{ type: 'ProductDetails', id },
			],
		}),

		// DELETE A PRODUCT

		deleteProduct: builder.mutation({
			query: (id) => ({
				url: `/admin/product/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Products'],
		}),

		// UPLOAD AN IMAGE

		uploadProductImages: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/products/${id}/upload_images`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['Product'],
		}),

		// DELETE AN IMAGE

		deleteProductImage: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/products/${id}/delete_images`,
					method: 'DELETE',
					body,
				};
			},
			invalidatesTags: ['Product'],
		}),

		// UPDATE IMAGE FLAG (is_minifig_builder)
		updateProductImageFlag: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/products/${id}/update_image_flag`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'ProductDetails', id },
				{ type: 'Product', id },
			],
		}),

		// --------------------------------- CATEGORIES ---------------------------------------

		getCategory: builder.query({
			query: () => `/categories`,
			providesTags: ['Categories'],
		}),

		// GET CATEGORY BY KEY

		getCategoryByKey: builder.query({
			query: (key) => `/categories/${key}`,
		}),

		// ADD A NEW CATEGORY

		createCategory: builder.mutation({
			query: (data) => ({
				url: '/admin/newCategory',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Categories'],
		}),

		// UPDATE A CATEGORY

		updateCategory: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/categories/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Categories'],
		}),

		// DELETE A CATEGORY

		deleteCategory: builder.mutation({
			query: (id) => ({
				url: `/admin/categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Categories'],
		}),

		// UPLOAD CATEGORY IMAGE
		uploadCategoryImage: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/categories/${id}/upload_image`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['Categories'],
		}),

		// --------------------------------- SUB-CATEGORIES ---------------------------------------

		// Sub-Category endpoints
		getSubCategories: builder.query({
			query: () => `/subcategories`,
			providesTags: ['SubCategories'],
		}),

		// ADD A NEW SUB-CATEGORY
		createSubCategory: builder.mutation({
			query: (data) => ({
				url: '/admin/newSubCategory',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['SubCategories'],
		}),

		// UPDATE A SUB-CATEGORY

		updateSubCategory: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/subcategories/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['SubCategories'],
		}),

		// DELETE A SUB-CATEGORY

		deleteSubCategory: builder.mutation({
			query: (id) => ({
				url: `/admin/subcategories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['SubCategories'],
		}),

		// UPLOAD SUB-CATEGORY IMAGE

		uploadSubCategoryImage: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/subcategories/${id}/upload_image`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['SubCategories'],
		}),

		// --------------------------------- COLLECTIONS ---------------------------------------

		// GET ALL COLLECTIONS

		getCollection: builder.query({
			query: () => `/collections`,
			providesTags: ['Collections'],
		}),

		// GET COLLECTION BY KEY

		getCollectionByKey: builder.query({
			query: (key) => `/collections/${key}`,
		}),

		// GET COLLECTION DETAILS
		getCollectionDetails: builder.query({
			query: (id) => `/collections/${id}`,
			providesTags: (result, error, id) => [
				{ type: 'CollectionDetails', id },
				{ type: 'Collection', id },
			],
		}),

		// ADD A NEW COLLECTION

		createCollection: builder.mutation({
			query: (data) => ({
				url: '/admin/newCollection',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Collections'],
		}),

		// UPDATE A COLLECTION

		updateCollection: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/collections/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Collections'],
		}),

		// DELETE A COLLECTION

		deleteCollection: builder.mutation({
			query: (id) => ({
				url: `/admin/collections/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Collections'],
		}),

		//ULOAD COLLECTION IMAGE

		uploadCollectionImage: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/collections/${id}/upload_image`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['Collections'],
		}),

		// --------------------------------- SUB-COLLECTIONS ---------------------------------------

		// Sub-Collection endpoints

		getSubCollections: builder.query({
			query: () => `/subcollections`,
			providesTags: ['SubCollections'],
		}),

		// ADD A NEW SUB-COLLECTION

		createSubCollection: builder.mutation({
			query: (data) => ({
				url: '/admin/newSubCollection',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['SubCollections'],
		}),

		// UPDATE A SUB-COLLECTION

		updateSubCollection: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/subcollections/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['SubCollections'],
		}),

		// DELETE A SUB-COLLECTION

		deleteSubCollection: builder.mutation({
			query: (id) => ({
				url: `/admin/subcollections/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['SubCollections'],
		}),

		// UPLOAD SUB-COLLECTION IMAGE

		uploadSubCollectionImage: builder.mutation({
			query({ id, body }) {
				return {
					url: `/admin/subcollections/${id}/upload_image`,
					method: 'PATCH',
					body,
				};
			},
			invalidatesTags: ['SubCollections'],
		}),

		// --------------------------------- GET SKILL LEVELS ---------------------------------------

		getSkillLevels: builder.query({
			query: () => `/skillLevels`,
			providesTags: ['SkillLevels'],
		}),

		// GET SKILL LEVEL BY KEY

		getSkillLevelByKey: builder.query({
			query: (key) => `/skillLevels/${key}`,
		}),

		// ADD A NEW SKILL LEVEL
		createSkillLevel: builder.mutation({
			query: (data) => ({
				url: '/admin/newSkillLevel',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['SkillLevels'],
		}),

		// UPDATE A SKILL LEVEL

		updateSkillLevel: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/skillLevels/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['SkillLevels'],
		}),

		// DELETE A SKILL LEVEL

		deleteSkillLevel: builder.mutation({
			query: (id) => ({
				url: `/admin/skillLevels/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['SkillLevels'],
		}),

		// --------------------------------- GET DESIGNERS ---------------------------------------

		getDesigners: builder.query({
			query: () => `/designers`,
			providesTags: ['Designers'],
		}),

		// GET DESIGNER BY KEY

		getDesignerByKey: builder.query({
			query: (key) => `/designers/${key}`,
		}),

		// ADD A NEW DESIGNER
		createDesigner: builder.mutation({
			query: (data) => ({
				url: '/admin/newDesigner',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Designers'],
		}),

		// UPDATE A DESIGNER
		updateDesigner: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/designers/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Designers'],
		}),

		// DELETE A DESIGNER

		deleteDesigner: builder.mutation({
			query: (id) => ({
				url: `/admin/designers/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Designers'],
		}),

		// --------------------------------- GET COLORS ---------------------------------------

		getColors: builder.query({
			query: () => `/colors`,
			providesTags: ['Colors'],
		}),

		// ADD A NEW COLOR
		createColor: builder.mutation({
			query: (data) => ({
				url: '/admin/newColor',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Colors'],
		}),

		// UPDATE A COLOR
		updateColor: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/admin/colors/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Colors'],
		}),

		// DELETE A COLOR
		deleteColor: builder.mutation({
			query: (id) => ({
				url: `/admin/colors/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Colors'],
		}),

		// --------------------------------- BANNERS ---------------------------------------
		// Get all banners
		getBanners: builder.query({
			query: () => '/banners',
			providesTags: ['Banners'],
		}),

		// Create banner
		createBanner: builder.mutation({
			query: (data) => ({
				url: '/admin/banners',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Banners'],
		}),

		// Delete banner
		deleteBanner: builder.mutation({
			query: (id) => ({
				url: `/admin/banners/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Banners'],
		}),

		// Get Dashboard Stats
		getDashboardStats: builder.query({
			query: () => `/admin/dashboard/stats`,
			providesTags: ['Orders', 'Products', 'Users'],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailsQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useGetCategoryQuery,
	useGetCollectionQuery,
	useGetSkillLevelsQuery,
	useGetDesignersQuery,
	useGetCategoryByKeyQuery,
	useDeleteProductMutation,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useCreateCollectionMutation,
	useCreateSkillLevelMutation,
	useCreateDesignerMutation,
	useUpdateCollectionMutation,
	useDeleteCollectionMutation,
	useUpdateSkillLevelMutation,
	useDeleteSkillLevelMutation,
	useUpdateDesignerMutation,
	useDeleteDesignerMutation,
	useUploadProductImagesMutation,
	useDeleteProductImageMutation,
	useGetCollectionDetailsQuery,
	useUploadCollectionImageMutation,
	useGetColorsQuery,
	useCreateColorMutation,
	useUpdateColorMutation,
	useDeleteColorMutation,
	useGetSubCategoriesQuery,
	useCreateSubCategoryMutation,
	useUpdateSubCategoryMutation,
	useDeleteSubCategoryMutation,
	useGetSubCollectionsQuery,
	useCreateSubCollectionMutation,
	useUpdateSubCollectionMutation,
	useDeleteSubCollectionMutation,
	useUploadCategoryImageMutation,
	useUploadSubCategoryImageMutation,
	useUploadSubCollectionImageMutation,
	useGetBannersQuery,
	useCreateBannerMutation,
	useDeleteBannerMutation,
	useGetDashboardStatsQuery,
	useUpdateProductImageFlagMutation,
} = productApi;
