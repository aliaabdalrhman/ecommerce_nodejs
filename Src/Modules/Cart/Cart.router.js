import Router from "express";
import * as cartController from './Cart.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Cart.role.js";
import validation from "../../Middelware/Validation.js";
import { addToCart } from "./Cart.validation.js";
const router = Router();


router.post('/', asyncHandler(auth(endPoints.add)),
    validation(addToCart),
    asyncHandler(cartController.addToCart));



export default router;