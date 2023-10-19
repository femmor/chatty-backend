// Express imports
import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';

// Env config
import { config } from '@root/config';

// Socket IO imports
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

// Standard and security middleware modules import
import cookieSession = require('cookie-session');
import cors = require('cors');
import hpp = require('hpp');
import compression = require('compression');
import helmet from 'helmet';
import 'express-async-errors';
import HTTP_STATUS from 'http-status-codes';
import http = require('http');
import Logger = require('bunyan');

// application routes import
import applicationRoutes from '@root/routes';
import { CustomError, IErrorResponse } from '@globals/helpers/error-handler';

// Destructure properties of config
const { PORT, SECRET_KEY_ONE, SECRET_KEY_TWO, NODE_ENV, CLIENT_URL, REDIS_HOST, createLogger } = config;

const log: Logger = createLogger('Server Setup');

// Server class
export class ChattyServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	// Public application start method
	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routesMiddleware(this.app);
		this.globalErrorHandler(this.app);
		this.startServer(this.app);
	}

	// private security middleware method
	private securityMiddleware(app: Application): void {
		app.use(
			cookieSession({
				name: 'session',
				keys: [SECRET_KEY_ONE || '', SECRET_KEY_TWO || ''],
				maxAge: 24 * 7 * 3600 || 0,
				secure: NODE_ENV !== 'development'
			})
		);

		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: CLIENT_URL,
				credentials: true,
				optionsSuccessStatus: 200,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			})
		);
	}

	// Private standard middleware method
	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(
			json({
				limit: '50mb'
			})
		);
		app.use(
			urlencoded({
				extended: true,
				limit: '50mb'
			})
		);
	}

	// private routes middleware method
	private routesMiddleware(app: Application): void {
		applicationRoutes(app);
	}

	// private global error handler method
	private globalErrorHandler(app: Application): void {
		app.all('*', (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({
				message: `${req.originalUrl} not found`
			});
		});
		app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
			log.error(error);

			if (error instanceof CustomError) {
				return res.status(error.statusCode).json(error.serializeErrors());
			}

			next();
		});
	}

	// private start server method
	private async startServer(app: Application): Promise<void> {
		try {
			const httpServer: http.Server = new http.Server(app);
			const socketIO: Server = await this.createSocketIO(httpServer);
			this.startHttpServer(httpServer);
			this.socketIOConnections(socketIO);
		} catch (error) {
			log.error(error);
		}
	}

	// private socketIO method
	private async createSocketIO(httpServer: http.Server): Promise<Server> {
		const io: Server = new Server(httpServer, {
			cors: {
				origin: CLIENT_URL,
				methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
			}
		});

		const pubClient = createClient({ url: REDIS_HOST });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
			io.adapter(createAdapter(pubClient, subClient));
			io.listen(3000);
		});

		return io;
	}

	// private start server method
	private startHttpServer(httpServer: http.Server): void {
		log.info(`Server has started with process ${process.pid}`);
		httpServer.listen(PORT, () => {
			log.info(`Server running on port ${PORT}`);
		});
	}

	// private socket.io connection method
	private socketIOConnections(io: Server): void {
		log.info('socket connections');
		// Todo - Remove below line of code
		io.on('connection', () => console.log('connected'));
	}
}
