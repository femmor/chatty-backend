/**
 * @fileOverview Defines the application routes.
 */

import { authRoutes } from '@auth/routes/authRoutes';
import { Application } from 'express';

const BASE_PATH = '/api/v1';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (app: Application) => {
	const routes = () => {
		app.use(BASE_PATH, authRoutes.routes());
	};

	routes();
};
