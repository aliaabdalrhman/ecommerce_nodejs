import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const addToCart = {
    body: joi.object({
        productId: generalFields.id,
    })
}

export const removeItem = {
    params: joi.object({
        productId: generalFields.id,
    })
}

export const increaseQty = {
    params: joi.object({
        productId: generalFields.id,
    })
}

export const decreaseQty = {
    params: joi.object({
        productId: generalFields.id,
    })
}

