/**
 * @fileOverview Defines the Reset Password schema for the Auth feature.
 */

import Joi, { ObjectSchema } from 'joi';

// Defines schema for the reset / update password request
const emailSchema: ObjectSchema = Joi.object().keys({
	// Defines the schema for the email field
	email: Joi.string().email().required().messages({
		'string.base': 'Field must be valid',
		'string.required': 'Field must be valid',
		'string.email': 'Field must be valid'
	})
});

const passwordSchema: ObjectSchema = Joi.object().keys({
	// Defines the schema for the password field
	password: Joi.string().required().min(4).max(8).messages({
		'string.base': 'Password should be of type string',
		'string.min': 'Invalid password',
		'string.max': 'Invalid password',
		'string.empty': 'Password is a required field'
	}),
	// Defines the schema for the confirm password field
	confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
		'any.only': 'Passwords should match',
		'any.required': 'Confirm password is a required field'
	})
});

export { emailSchema, passwordSchema };
