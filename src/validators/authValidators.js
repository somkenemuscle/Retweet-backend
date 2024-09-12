import Joi from 'joi';

// Joi validation signup schema
export const signUpSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9.-]+$/)  // Allows letters, numbers, dots,  and dashes
        .min(4)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Username can only contain letters, numbers, dots,  and dashes.',
            'string.min': 'Username must be at least 4 characters long.',
            'string.max': 'Username must be less than 20 characters long.',
        }),
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Must be a valid email address with format "name@gmail.com".',
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Username must be less than 50 characters long.',
        })
});




// Joi validation signin schema
export const signInSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9.-]+$/)  // Allows letters, numbers, dots,  and dashes
        .min(4)
        .max(20)
        .required()
        .messages({
            'string.pattern.base': 'Username can only contain letters, numbers, dots,  and dashes.',
            'string.min': 'Username must be at least 3 characters long.',
            'string.max': 'Username must be less than 20 characters long.',
        }),
    password: Joi.string()
        .min(6)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'string.max': 'Username must be less than 50 characters long.',
        })
});

