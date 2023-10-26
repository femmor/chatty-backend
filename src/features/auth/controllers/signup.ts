import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidator } from '@globals/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { authService } from '@services/db/auth.service';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { BadRequestError } from '@globals/helpers/error-handler';
import { AuthModel } from '@auth/models/auth.schema';
import { Helpers } from '@globals/helpers/helpers';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { uploads } from '@globals/helpers/cloudinary-upload';

export class SignUp {
	@joiValidator(signupSchema)
	public async create(req: Request, res: Response): Promise<void> {
		const { username, email, password, avatarColor, avatarImage } = req.body;

		// Check if username or email already exists using a service
		const checkIfUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);

		if (checkIfUserExists) {
			// Throw an error if user already exists
			throw new BadRequestError('Invalid credentials');
		}

		// Creates our own Ids for the user and auth objects
		const authObjectId: ObjectId = new ObjectId();
		const userObjectId: ObjectId = new ObjectId();
		const uId: number = Helpers.generateRandomIntegers(12);

		// Creates the user object
		const authData: IAuthDocument = SignUp.prototype.signupData({
			_id: authObjectId,
			uId,
			username,
			email,
			password,
			avatarColor
		});

		// Call the cloudinary upload function to upload the avatar image
		const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
		// For the user image we need to set the public id, once user changes their avatar we need to update the public id

		// If there is an error uploading the image, it won't return a public id so we need to check for that
		if (!result?.public_id) {
			// Throw an error if there is an error uploading the image
			throw new BadRequestError('File upload: An error occurred while uploading the avatar image, please try again');
		}
	}

	// Create the signup data object
	private signupData(data: ISignUpData): IAuthDocument {
		const { _id, uId, username, email, password, avatarColor } = data;

		return {
			_id,
			uId,
			username: Helpers.firstLetterUppercase(username),
			email: Helpers.convertToLowerCase(email),
			password,
			avatarColor,
			createdAt: new Date()
		} as unknown as IAuthDocument;
	}
}
