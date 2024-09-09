import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const createSubCategorySchema = {
    body: joi.object({
        name: generalFields.name,
    }),
    params: joi.object({
        categoryId: generalFields.id,
    })
}

export const getAllSubCategoryByCategoryIdSchema = {
    params: joi.object({
        categoryId: generalFields.id,
    })
}

export const getSubCategoryDetailsSchema = {
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,

    })
}

export const deleteSubCategorySchema = {
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,

    })
}

export const updateSubCategorySchema = {
    body: joi.object({
        name: generalFields.name,
        status:generalFields.status
    }),
    params: joi.object({
        id: generalFields.id,
        categoryId: generalFields.id,

    })
}
