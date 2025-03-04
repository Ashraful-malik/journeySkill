import mongoose from "mongoose";

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
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: DB_NAME,
        maxPoolSize: 20, // Optimized for production
        serverSelectionTimeoutMS: 10000, // 10 sec timeout
      })
      .then((mongooseInstance) => {
        isConnected = true;

        mongoose.connection.on("connected", () => {});
        mongoose.connection.on("error", (err) => {});

        mongoose.connection.on("disconnected", () => {});
        return mongooseInstance;
      })
      .catch((err) => {
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};
export default dbConnect;
