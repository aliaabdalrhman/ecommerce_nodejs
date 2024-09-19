import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const addToCart = {
    body: joi.object({
        productId: generalFields.id,
    })
}

export const removeItem = {
    body: joi.object({
        productId: generalFields.id,
    })
}