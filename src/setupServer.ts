import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";

import { config } from "./config";

import cookieSession = require("cookie-session");
import cors = require("cors");
import hpp = require("hpp");
import compression = require("compression");
import helmet from "helmet";
import "express-async-errors";
import HTTP_STATUS from "http-status-codes";
import http = require("http");

const { PORT, SECRET_KEY_ONE, SECRET_KEY_TWO, NODE_ENV, CLIENT_URL } = config;

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: [SECRET_KEY_ONE || "", SECRET_KEY_TWO || ""],
        maxAge: 24 * 7 * 3600 || 0,
        secure: NODE_ENV !== "development",
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(
      json({
        limit: "50mb",
      })
    );
    app.use(
      urlencoded({
        extended: true,
        limit: "50mb",
      })
    );
  }

  private routesMiddleware(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}
