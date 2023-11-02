/**
 * @fileOverview Application entry point
 */

import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import DbConnection from './setupDatabase';
import { config } from './config';

class Application {
	public initialize(): void {
		this.loadConfig();
		DbConnection();
		const app: Express = express();
		const server: ChattyServer = new ChattyServer(app);
		server.start();
	}

	private loadConfig(): void {
		config.validateConfig();
		config.cloudinaryConfig();
	}
}

const application: Application = new Application();
application.initialize();
