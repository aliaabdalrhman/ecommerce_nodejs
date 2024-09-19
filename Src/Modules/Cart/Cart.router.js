import Router from "express";
import * as cartController from './Cart.controller.js'
import { asyncHandler } from "../../Utilities/CatchError.js";
import { auth } from "../../Middelware/Auth.js";
import { endPoints } from "./Cart.role.js";
import validation from "../../Middelware/Validation.js";
import { addToCart, removeItem } from "./Cart.validation.js";
const router = Router();


router.post('/', asyncHandler(auth(endPoints.add)),
    validation(addToCart),
    asyncHandler(cartController.addToCart));

router.delete('/', asyncHandler(auth(endPoints.delete)),
    validation(removeItem),
    asyncHandler(cartController.removeItem));

    router.delete('/clearCart', asyncHandler(auth(endPoints.delete)),
    asyncHandler(cartController.clearCart));


export default router;