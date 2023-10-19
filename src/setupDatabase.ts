import mongoose from "mongoose";
import { config } from "./config";

const dbUrl: string = config.MONGO_URI || "";

export default () => {
  const connect = async () => {
    try {
      await mongoose.connect(dbUrl);
      console.log("Database connected successfully!");
    } catch (error) {
      console.log(`Error connecting to database: ${error}`);
      return process.exit(1);
    }
  };

  connect();

  mongoose.connection.on("disconnected", connect);
};
