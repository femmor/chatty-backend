import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';
import { Helpers } from '@globals/helpers/helpers';

class AuthService {
	public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
		// Query to check
		const query = { $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.convertToLowerCase(email) }] };

		const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;

		return user;
	}
}

export const authService: AuthService = new AuthService();
