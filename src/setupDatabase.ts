import mongoose from "mongoose";
import { config } from "./config";
import Logger = require("bunyan");

const { MONGO_URI, createLogger } = config;

const log: Logger = createLogger("DB Setup");

const dbUrl: string = MONGO_URI || "";

export default () => {
  const connect = async () => {
    try {
      await mongoose.connect(dbUrl);
      log.info("Database connected successfully!");
    } catch (error) {
      log.error(`Error connecting to database: ${error}`);
      return process.exit(1);
    }
  };

  connect();

  mongoose.connection.on("disconnected", connect);
};
