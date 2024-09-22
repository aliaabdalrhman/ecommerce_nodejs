import joi from 'joi'

const dataMethods = ['body', 'params', 'query'];

export const generalFields = {
    email: joi.string().email().min(6).max(50).required().messages({
        'string.empty': 'email is required',
        'string.email': 'please provide a valid email address'
    }),
    password: joi.string().min(8).required().messages({
        'string.empty': 'password is required',
        'string.min': 'password must be at least 8 characters long',
    }),
    id: joi.string().length(24).required().messages({
        "string.length": "id must be 24 characters long",
    }),
    name: joi.string().required().min(3).max(50).messages({
        'string.empty': 'name is required',
        'string.min': 'name must be at least 3 characters long',
        'string.max': 'name cannot be more than 20 characters long'
    }),
    status: joi.string().valid('Active', 'InActive').messages({
        'any.only': 'status must be either Active or InActive ',
        'string.empty': 'status is required'
    })
}

const validation = (schema) => {
    const validationArray = [];
    return (req, res, next) => {
        dataMethods.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false });
                if (validationResult.error) {
                    validationArray.push(validationResult.error.details);
                }
            }
        });
        if (validationArray.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationArray });
        }
        else {
            next();
        }
    }
}

export default validation;