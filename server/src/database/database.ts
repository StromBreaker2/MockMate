import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mockmate";

  try {
    const db = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully to:", MONGO_URI.replace(/\/\/.*@/, "//***@"));
  } catch (error: any) {
    console.warn("⚠️ Primary MongoDB Atlas connection timed out (IP whitelist / network change). Connecting to local MongoDB fallback...");
    try {
      const localUri = "mongodb://127.0.0.1:27017/mockmate";
      const db = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
      isConnected = db.connections[0].readyState === 1;
      console.log("✅ Connected to local MongoDB fallback at 127.0.0.1:27017/mockmate");
    } catch (localErr) {
      console.error("❌ MongoDB connection error:", error);
      if (process.env.NODE_ENV === "production") {
        throw new Error("Failed to connect to MongoDB");
      }
    }
  }
};

export default connectDB;
