import joi from "joi";
import { generalFields } from "../../Middelware/Validation.js";

export const createCategorySchema = {
    body: joi.object({
        name: generalFields.name,
        status: generalFields.status,
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

