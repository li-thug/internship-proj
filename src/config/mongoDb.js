import mongoose from "mongoose";
import env from "../utils/validateEnv.js";

const connection = {};

export const connectToDb = async () => {
  if (connection.isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(env.MONGODB_URL);
    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};