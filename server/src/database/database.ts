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
    const db = await mongoose.connect(MONGO_URI, {});
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected successfully to:", MONGO_URI.replace(/\/\/.*@/, "//***@"));
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // In dev, warn rather than crash immediately to allow diagnostics
    if (process.env.NODE_ENV === "production") {
      throw new Error("Failed to connect to MongoDB");
    }
  }
};

export default connectDB;
