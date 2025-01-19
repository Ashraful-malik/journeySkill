import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

let isConnected = false;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined!");
  }

  if (!DB_NAME) {
    throw new Error("DB_NAME environment variable is not defined!");
  }
  if (cached.conn) {
    console.log("Reusing existing database connection.");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: DB_NAME,
        maxPoolSize: 10, // Connection pool size
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB is unreachable
      })
      .then((mongooseInstance) => {
        console.log("Database connected successfully.");
        isConnected = true;
        mongoose.connection.on("connected", () => {
          console.log("Mongoose connected to database");
        });
        mongoose.connection.on("error", (err) => {
          console.error("Mongoose connection error:", err);
        });
        mongoose.connection.on("disconnected", () => {
          console.warn("Mongoose disconnected ");
        });
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("Database connection error:", err);
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};
export default dbConnect;
