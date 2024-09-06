// export default router;
// Importing necessary modules and controllers
import { Router } from "express";
import * as categoryController from './Category.controller.js';
import { asyncHandler } from "../../Utilities/CatchError.js";
import fileUpload from "../../Utilities/Multur.js";
import validation from "../../Middelware/Validation.js";
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from "./Category.validation.js";

const router = Router(); // Initialize a new router instance

// Route to get all categories
// The asyncHandler utility is used to catch any errors in the asynchronous controller function
router.get('/', asyncHandler(categoryController.getAllCategories));

// Route to create a new category
// This route also handles file uploads, using the fileUpload middleware to process a single image file
router.post('/createCategory',  fileUpload().single('image'), validation(createCategorySchema),asyncHandler(categoryController.createCategory));

// Route to get details of a specific category by ID
// The category ID is passed as a URL parameter
router.get('/CategoryDetails/:id', validation(getCategorySchema), asyncHandler(categoryController.getCategoryDetails));

// Route to update an existing category by ID
// The category ID is passed as a URL parameter, and the update data is expected in the request body
router.put('/updateCategory/:id', validation(updateCategorySchema), asyncHandler(categoryController.updateCategory));

// Route to delete a category by ID
// The category ID is passed as a URL parameter
router.delete('/deletCategory/:id', validation(deleteCategorySchema), asyncHandler(categoryController.deletCategory));

export default router; // Export the configured router for use in the main application
