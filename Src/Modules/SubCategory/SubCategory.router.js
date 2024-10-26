import { Router } from "express";
import * as subCategoryController from './SubCategory.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./SubCategory.role.js";
import fileUpload, { fileType } from "../../Utilities/Multur.js";
import validation from "../../Middelware/Validation.js";
import { createSubCategorySchema, deleteSubCategorySchema, getAllSubCategoryByCategoryIdSchema, getSubCategoryDetailsSchema, updateSubCategorySchema } from "./SubCategory.validation.js";


const router = Router({ mergeParams: true });
router.post('/', fileUpload(fileType.image).single('image'), asyncHandler(auth(endPoints.create)), validation(createSubCategorySchema), asyncHandler(subCategoryController.createSubCategory));
router.get('/', asyncHandler(auth(endPoints.getAll)),validation(getAllSubCategoryByCategoryIdSchema), asyncHandler(subCategoryController.getAllSubCategoryByCategoryId));
router.get('/active', asyncHandler(subCategoryController.getActiveSubCategory));
router.get('/:id', validation(getSubCategoryDetailsSchema), asyncHandler(subCategoryController.getSubCategoryDetails));
router.put('/:id', asyncHandler(auth(endPoints.update)), validation(updateSubCategorySchema), asyncHandler(subCategoryController.updateSubCategory));
router.delete('/:id', asyncHandler(auth(endPoints.delete)), validation(deleteSubCategorySchema), asyncHandler(subCategoryController.deleteSubCategory));

export default router;