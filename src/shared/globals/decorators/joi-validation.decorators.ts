/**
 * @fileOverview Validator decorator for Joi validation
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { JoiRequestValidationError } from '@globals/helpers/error-handler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidator(schema: ObjectSchema): IJoiDecorator {
	return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (...args: any[]) {
			const request: Request = args[0];
			const body = request.body;
			const { error } = await Promise.resolve(schema.validate(body));
			if (error?.details) {
				throw new JoiRequestValidationError(error.details[0].message);
			}
			return await originalMethod.apply(this, args);
		};
		return descriptor;
	};
}
