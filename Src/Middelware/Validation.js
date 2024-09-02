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
            res.status(400).json({ message: validationArray });
        }
        else {
            next();
        }
    }
}

export default validation;