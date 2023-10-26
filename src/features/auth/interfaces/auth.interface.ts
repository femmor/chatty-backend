/**
 * @fileOverview Defines the auth interfaces.
 */

import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// Adds the currentUser property to the Express Request object
declare global {
	namespace Express {
		interface Request {
			currentUser?: AuthPayload;
		}
	}
}

// Defines the interface for the AuthPayload object
export interface AuthPayload {
	userId: string;
	uId: string;
	email: string;
	username: string;
	avatarColor: string;
	iat?: number;
}

// Defines the interface for the AuthDocument object
export interface IAuthDocument extends Document {
	_id: string | ObjectId;
	uId: string;
	username: string;
	email: string;
	password?: string;
	avatarColor: string;
	createdAt: Date;
	passwordResetToken?: string;
	passwordResetExpires?: number | string;
	comparePassword(password: string): Promise<boolean>;
	hashPassword(password: string): Promise<string>;
}

// Defines the interface for the AuthModel object
export interface ISignUpData {
	_id: ObjectId;
	uId: number;
	email: string;
	username: string;
	password: string;
	avatarColor: string;
}

// Defines the interface for the Auth job object
export interface IAuthJob {
	value?: string | IAuthDocument;
}
