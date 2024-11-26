import mongoose from "mongoose";
import { DB_NAME } from "./constants";

let isConnected = false;
const dbConnect = async () => {
  if (isConnected || mongoose.connection.readyState) {
    console.log(
      "=====================Database already connected=============="
    );
    return;
  }
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    isConnected = true;

    console.log(
      "====================:db connected Successfully :=============="
    );
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
export default dbConnect;
