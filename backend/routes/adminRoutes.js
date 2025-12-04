import express from 'express';
import {
	deleteAllProducts,
	deleteProductByID,
	deleteProductImage,
	newProduct,
	updateProduct,
	updateProductImageMinifigFlag,
	uploadProductImage,
} from '../controllers/productController.js';

import {
	createCategory,
	deleteCategoryByID,
	updateCategory,
} from '../controllers/categoryController.js';

import {
	createCollection,
	deleteCollectionByID,
	updateCollection,
	uploadCollectionImage,
} from '../controllers/collectionControler.js';
import {
	createDesigners,
	deleteDesignerById,
	updateDesignerById,
} from '../controllers/designerController.js';
import {
	createSkillLevel,
	deleteSkillByID,
	updateSkillLevel,
} from '../controllers/skillLevelController.js';
import {
	isAuthenticatedUser,
	isAuthorizedUser,
} from '../middlewares/auth.middleware.js';

import { userRoles } from '../Utills/Roles.js';
import {
	deleteSingleUser,
	getAllUsers,
	getSingleUser,
	updateSingleUser,
} from '../controllers/adminController.js';
import {
	deleteColorbyId,
	getAllColors,
	getColorById,
	updateColorById,
	createColor,
} from '../controllers/colorController.js';
import {
	createSubCategory,
	deleteSubCategoryByID,
	updateSubCategory,
	getAllSubCategories,
} from '../controllers/subCategoryController.js';
import {
	createSubCollection,
	deleteSubCollectionByID,
	updateSubCollection,
	uploadSubCollectionImage,
	getAllSubCollections,
} from '../controllers/subCollectionController.js';
import {
	getAllBanners,
	createBanner,
	updateBanner,
	deleteBanner,
} from '../controllers/bannerController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// ---------------------------------- CATEGORIES --------------------------------------------------

// CREATE NEW CATEGORIES
router
	.route('/admin/newCategory')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createCategory
	);

// UPDATE A CATEGORIES BY ADMIN
router
	.route('/admin/categories/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateCategory
	);

// DELETE A CATEGORIES BY ADMIN
router
	.route('/admin/categories/:id')
	.delete(
		(isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteCategoryByID)
	);

// ---------------------------------- COLLECTION --------------------------------------------------

// CREATE NEW COLLECTION
router
	.route('/admin/newCollection')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createCollection
	);

// UPDATE A COLLECTION BY ADMIN
router
	.route('/admin/collections/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateCollection
	);

// DELETE A COLLECTION BY ADMIN
router
	.route('/admin/collections/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteCollectionByID
	);

// UPLOAD A COLLECTION IMAGE BY ADMIN
router
	.route('/admin/collections/:id/upload_image')
	.patch(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		uploadCollectionImage
	);

// ---------------------------------- SUBCATEGORIES --------------------------------------------------

// GET ALL SUBCATEGORIES
router
	.route('/subcategories')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getAllSubCategories
	);

// CREATE NEW SUBCATEGORIES
router
	.route('/admin/newSubCategory')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createSubCategory
	);

// UPDATE A SUB CATEGORY BY ADMIN
router
	.route('/admin/subcategories/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateSubCategory
	);

// DELETE A SUBCATEGORY BY ADMIN
router
	.route('/admin/subcategories/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteSubCategoryByID
	);

// ---------------------------------- SUB COLLECTION --------------------------------------------------

// GET ALL SUBCOLLECTIONS
router
	.route('/admin/subcollections')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getAllSubCollections
	);

// CREATE NEW SUBCOLLECTION
router
	.route('/admin/newSubCollection')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createSubCollection
	);

// UPDATE A SUB-COLLECTION BY ADMIN
router
	.route('/admin/subcollections/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateSubCollection
	);

// DELETE A COLLECTION BY ADMIN
router
	.route('/admin/subcollections/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteSubCollectionByID
	);

// UPLOAD A SUB COLLECTION IMAGE BY ADMIN
router
	.route('/admin/subcollections/:id/upload_image')
	.patch(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		uploadSubCollectionImage
	);

// ---------------------------------- SKILL --------------------------------------------------

// CREATE NEW SKILLS
router
	.route('/admin/newSkillLevel')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createSkillLevel
	);

// UPDATE A SKILLS BY ADMIN
router
	.route('/admin/skillLevels/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateSkillLevel
	);

// DELETE A SKILLS BY ADMIN
router
	.route('/admin/skillLevels/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteSkillByID
	);

// ---------------------------------- DESIGNER --------------------------------------------------
// CREATE NEW DESIGNER
router
	.route('/admin/newDesigner')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createDesigners
	);

// UPDATE A COLLECTION BY ADMIN
router
	.route('/admin/designers/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateDesignerById
	);

// DELETE A DESIGNER BY ADMIN
router
	.route('/admin/designers/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteDesignerById
	);

// ---------------------------------- PRODUCTS --------------------------------------------------

// CREATE NEW PRODUCT
router
	.route('/admin/newProduct')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE,
			userRoles.SELLER
		),
		newProduct
	);

// UPDATE A PRODUCT BY ADMIN
router
	.route('/admin/product/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE,
			userRoles.SELLER
		),
		updateProduct
	);

// DELETE A PRODUCT BY ADMIN
router
	.route('/admin/product/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteProductByID
	);

// UPLOAD PRODUCT IMAGE
router
	.route('/admin/products/:id/upload_images')
	.patch(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		uploadProductImage
	);
// Update Product Image to Include it in minifig builder
router
	.route('/admin/products/:id/update_image_flag')
	.patch(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateProductImageMinifigFlag
	);

// DELETE PRODUCT IMAGE
router
	.route('/admin/products/:id/delete_images')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteProductImage
	);

// DELETE ALL PRODUCTS
router
	.route('/admin/products')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(userRoles.SUPER_ADMIN, userRoles.ADMIN),
		deleteAllProducts
	);

// ---------------------------------- COLOR --------------------------------------------------

// GET ALL COLORS
router
	.route('/admin/colors')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getAllColors
	);

// CREATE NEW COLOR
router
	.route('/admin/newColor')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createColor
	);

// GET SPECIFIC COLOR INFORMATION
router
	.route('/admin/colors/:id')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getColorById
	);

// UPDATE SPECIFIC COLOR INFORMATION

router
	.route('/admin/colors/:id')
	.patch(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateColorById
	);

// DELETE SPECIFIC COLOR
router
	.route('/admin/colors/:id')
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteColorbyId
	);

// GET ALL USERS
router
	.route('/admin/users')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getAllUsers
	);

// GET SPECIFIC USER INFORMATION, Update and Delete
router
	.route('/admin/users/:id')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getSingleUser
	)
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(userRoles.SUPER_ADMIN, userRoles.ADMIN),
		updateSingleUser
	)
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(userRoles.SUPER_ADMIN),
		deleteSingleUser
	);

// Banner routes
router.route('/banners').get(getAllBanners);
router
	.route('/admin/banners')
	.post(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		createBanner
	);
router
	.route('/admin/banners/:id')
	.put(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		updateBanner
	)
	.delete(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		deleteBanner
	);

// Dashboard Stats Route
router
	.route('/admin/dashboard/stats')
	.get(
		isAuthenticatedUser,
		isAuthorizedUser(
			userRoles.SUPER_ADMIN,
			userRoles.ADMIN,
			userRoles.EMPLOYEE
		),
		getDashboardStats
	);

export default router;
