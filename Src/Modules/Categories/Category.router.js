// export default router;
// Importing necessary modules and controllers
import { Router } from "express";
import * as categoryController from './Category.controller.js';
import { asyncHandler } from "../../Utilities/CatchError.js";
import fileUpload from "../../Utilities/Multur.js";
import validation from "../../Middelware/Validation.js";
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from "./Category.validation.js";
import { auth } from "../../Middelware/auth.js";
import { endPoints } from "./Category.role.js";
import subCategoryRouter from '../SubCategory/SubCategory.router.js'


const router = Router(); // Initialize a new router instance

router.use('/:categoryId/subCategory', subCategoryRouter);

// Route to get all categories
router.get('/', asyncHandler(categoryController.getAllCategories));

// Route to create a new category
router.post('/createCategory', fileUpload().single('image'), asyncHandler(auth(endPoints.create)), validation(createCategorySchema), asyncHandler(categoryController.createCategory));

// Route to get details of a specific category by ID
router.get('/CategoryDetails/:id', validation(getCategorySchema), asyncHandler(categoryController.getCategoryDetails));

// Route to update an existing category by ID
router.put('/updateCategory/:id', asyncHandler(auth(endPoints.update)), validation(updateCategorySchema), asyncHandler(categoryController.updateCategory));

// Route to delete a category by ID
router.delete('/deletCategory/:id', asyncHandler(auth(endPoints.delete)), validation(deleteCategorySchema), asyncHandler(categoryController.deletCategory));

export default router; // Export the configured router for use in the main application
