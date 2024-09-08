import { Router } from "express";
import * as subCategoryController from './SubCategory.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/auth.js";
import { endPoints } from "./SubCategory.role.js";
import fileUpload from "../../Utilities/Multur.js";
import validation from "../../Middelware/Validation.js";
import { createSubCategorySchema, deleteSubCategorySchema, getAllSubCategoryByCategoryIdSchema, getSubCategoryDetailsSchema, updateSubCategorySchema } from "./SubCategory.validation.js";

const router = Router();

router.post('/createSubCategory/:categoryId', fileUpload().single('image'), asyncHandler(auth(endPoints.create)), validation(createSubCategorySchema), asyncHandler(subCategoryController.createSubCategory));
router.get('/getAllSubCategory', asyncHandler(subCategoryController.getAllSubCategory));
router.get('/getAllSubCategory/:categoryId', validation(getAllSubCategoryByCategoryIdSchema), asyncHandler(subCategoryController.getAllSubCategoryByCategoryId));
router.get('/getSubCategoryDetails/:id', validation(getSubCategoryDetailsSchema), asyncHandler(subCategoryController.getSubCategoryDetails));
router.put('/updateSubCategory/:id', asyncHandler(auth(endPoints.update)), validation(updateSubCategorySchema), asyncHandler(subCategoryController.updateSubCategory));
router.delete('/deleteSubCategory/:id', asyncHandler(auth(endPoints.delete)), validation(deleteSubCategorySchema), asyncHandler(subCategoryController.deleteSubCategory));
export default router;