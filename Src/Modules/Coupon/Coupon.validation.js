import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";


export const createCouponSchema = {
    body: joi.object({
        name: generalFields.name,
        amount: joi.number().positive().required(),
        expireDate: joi.required()
    }),
}

export const getCouponByIdSchema = {
    params: joi.object({
        id: generalFields.id,
    })
}

export const deleteCouponSchema = {
    params: joi.object({
        id: generalFields.id,
    })
}

export const updateCouponSchema = {
    body: joi.object({
        name: generalFields.name.optional(),
        amount: joi.number().positive().optional(),
        expireDate: joi.optional()
    }),
    params: joi.object({
        id: generalFields.id,
    })
}

