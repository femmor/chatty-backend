/**
 * @fileOverview Defines the AuthModel schema, which is used to define the Auth model.
 */

import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { hash, compare } from 'bcryptjs';
import { model, Model, Schema } from 'mongoose';

// Bcryptjs salt round
const SALT_ROUND = 10;

const authSchema: Schema = new Schema(
	{
		username: { type: String },
		uId: { type: String },
		email: { type: String },
		password: { type: String },
		avatarColor: { type: String },
		createdAt: { type: Date, default: Date.now },
		passwordResetToken: { type: String, default: '' },
		passwordResetExpires: { type: Number }
	},
	// Deletes the password from the response and returns the document
	{
		toJSON: {
			transform(_doc, ret) {
				delete ret.password;
				return ret;
			}
		}
	}
);

// Hash the password before saving it to the database when user is registering
authSchema.pre('save', async function (this: IAuthDocument, next: () => void) {
	const hashedPassword: string = await hash(this.password as string, SALT_ROUND);
	this.password = hashedPassword;
	next();
});

// Compare the password with the hashed password
authSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
	const hashedPassword: string = (this as unknown as IAuthDocument).password!;
	return compare(password, hashedPassword);
};

// Hash the password before saving it to the database when user is updating their profile
authSchema.methods.hashPassword = async function (password: string): Promise<string> {
	return hash(password, SALT_ROUND);
};

// Exports the AuthModel object
const AuthModel: Model<IAuthDocument> = model<IAuthDocument>('Auth', authSchema, 'Auth');
export { AuthModel };
