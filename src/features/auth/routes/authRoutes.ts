/**
 * @fileOverview Defines the AuthRoutes class, which is used to define all of the routes for the Auth feature.
 */

import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

class AuthRoutes {
	// defines the router
	private router: Router;

	constructor() {
		// router initialization
		this.router = express.Router();
	}

	public routes(): Router {
		// Sign up route
		this.router.post('/signup', SignUp.prototype.create);

		return this.router;
	}
}

export const authRoutes: AuthRoutes = new AuthRoutes();
