import express = require("express");
import { Express } from "express";
import { ChattyServer } from "./setupServer";
import DbConnection from "./setupDatabase";

class Application {
  public initialize(): void {
    DbConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
