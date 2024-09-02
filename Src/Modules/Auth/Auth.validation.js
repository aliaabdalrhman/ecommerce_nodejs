import joi from 'joi';
import { generalFields } from '../../Middelware/Validation.js';

export const registerSchema = {
    body: joi.object({
        username: joi.string().min(3).max(20).required().messages({
            'string.empty': 'username is required',
            'string.min': 'username must be at least 3 characters long',
            'string.max': 'username cannot be more than 20 characters long'
        }),
        email: generalFields.email,
        password: generalFields.password,
        cpassword: joi.valid(joi.ref('password')).required().messages({
            'any.only': 'passwords must match'
        })
    })
}

export const loginSchema = {
    body: joi.object({
        email: generalFields.email,
        password: generalFields.password,
    })
}