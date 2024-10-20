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
        categoryId: generalFields.id,
        subCategoryId: generalFields.id,
        price: joi.number().min(1).required(),
        stock: joi.number().min(0).default(1).required(),
        colors: joi.string().optional(),
        sizes: joi.string().optional(),
        discount:joi.number().integer().min(0).default(0).positive().optional(),
        // file: joi.object({
        //     mainImage: joi.array().items(generalFields.file.required()).length(1),
        //     subImages: joi.array().items(generalFields.file.required()).min(2).max(5)
        // }),
    }),
}

export const getProductByIdSchema = {
    params: joi.object({
        id: generalFields.id,
    })
}


export const deleteProductSchema = {
    params: joi.object({
        id: generalFields.id,
    })
}

