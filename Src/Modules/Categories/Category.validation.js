import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const createCategorySchema = {
    body: joi.object({
        name: generalFields.name,
    })
}

export const getCategorySchema = {
    params: joi.object({
        id: generalFields.id,
    })
}
export const deleteCategorySchema = {
    params: joi.object({
        id: generalFields.id,
    })
}

export const updateCategorySchema = {
    body: joi.object({
        name: generalFields.id,
        status: joi.string().valid('Active', 'active', 'inactive', 'InActive').messages({
            'any.only': 'status must be either Active ,active, InActive or inactive',
            'string.empty': 'status is required'
        })
    }),
    params: joi.object({
        id: generalFields.id,
    })
}

