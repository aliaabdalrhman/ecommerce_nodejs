import joi from 'joi';
import { generalFields } from "../../Middelware/Validation.js";

export const createProductSchema = {
    body: joi.object({
        name: generalFields.name,
        description: joi.string().required().min(3).max(100).messages({
            'string.empty': 'email is required',
            'string.min': 'description must be at least 3 characters long',
            'string.max': 'description cannot be more than 100 characters long',
            "string.base": "Description must be a string",
        }),
        price: joi.number().required(),
        stock: joi.number().required(),
    }),
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,
        subCategoryId: generalFields.id
    })
}

export const getAllProductsSchema = {
    params: joi.object({
        categoryId: generalFields.id,
        subCategoryId: generalFields.id
    })
}

export const getProductByIdSchema = {
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,
        subCategoryId: generalFields.id
    })
}


export const deleteProductSchema = {
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,
        subCategoryId: generalFields.id
    })
}

