/**
 * @fileOverview Error handler interfaces and classes
 */

import HTTP_STATUS from 'http-status-codes';

// Error response interface
export interface IErrorResponse {
	message: string;
	statusCode: number;
	status: string;
	serializeErrors(): IError;
}

// Error interface
export interface IError {
	message: string;
	statusCode: number;
	status: string;
}

// custom error class / extends the Error constructor
export abstract class CustomError extends Error {
	abstract statusCode: number;
	abstract status: string;

	constructor(message: string) {
		super(message);
	}

	// Serialize errors method
	serializeErrors(): IError {
		return {
			message: this.message,
			status: this.status,
			statusCode: this.statusCode
		};
	}
}

// Used for custom joi validation error
export class JoiRequestValidationError extends CustomError {
	statusCode = HTTP_STATUS.BAD_REQUEST;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}

// Bad request errors
export class BadRequestError extends CustomError {
	statusCode = HTTP_STATUS.BAD_REQUEST;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}

// 404 error not found class
export class NotFoundError extends CustomError {
	statusCode = HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}

// Unauthorized error class
export class UnAuthorizedError extends CustomError {
	statusCode = HTTP_STATUS.UNAUTHORIZED;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}

// Files too large errors
export class FileTooLargeError extends CustomError {
	statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}

// Server error class - 500
export class ServerError extends CustomError {
	statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
	status = 'error';

	constructor(message: string) {
		super(message);
	}
}
