import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/database";

import userRoutes from "./routes/user.routes";
import mockinterviewRoutes from "./routes/mockinterview.routes";
import geminiRoutes from "./routes/gemini.routes";
import healthRoutes from "./routes/health.routes";
import resumeRoutes from "./routes/resume.routes";
import jobRoutes from "./routes/job.routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean) as string[];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching whitelist
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static("./public"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/mockinterview", mockinterviewRoutes);
app.use("/api/ai", geminiRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/jobs", jobRoutes);

export default app;

