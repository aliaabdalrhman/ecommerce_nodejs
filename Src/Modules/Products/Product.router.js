import { Router } from "express";
import * as productController from './Product.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import fileUpload from "../../Utilities/Multur.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Product.role.js";
import validation from "../../Middelware/Validation.js";
import { createProductSchema, deleteProductSchema, getProductByIdSchema } from "./Product.validation.js";
import reviewRouter from "../Reviews/Review.router.js";

const router = Router();

router.use('/:productId/review', reviewRouter);

router.post('/',
    fileUpload().fields([{ name: 'mainImage', maxCount: 1 }, { name: 'subImages', maxCount: 5 }]),
    asyncHandler(auth(endPoints.create)),
    validation(createProductSchema),
    asyncHandler(productController.createProduct));

router.get('/',
    asyncHandler(productController.getAllProduct));

router.get('/:id', validation(getProductByIdSchema),
    asyncHandler(productController.getProductById));

router.delete('/:id', asyncHandler(auth(endPoints.delete)),
    validation(deleteProductSchema),

    asyncHandler(productController.deleteProduct));

export default router;