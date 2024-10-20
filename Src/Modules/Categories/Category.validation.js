import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const createCategorySchema = {
    body: joi.object({
        name: generalFields.name,
        status: generalFields.status,
        // image: joi.object({
        //     fieldname: joi.string().min(3).required(),
        //     originalname: joi.string().required()
        // })
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
        name: generalFields.name,
        status: generalFields.status,
    }),
    params: joi.object({
        id: generalFields.id,
    })
}

