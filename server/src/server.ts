import app from "./app";
import dotenv from "dotenv";
import http from "http";
import serverless from "serverless-http";

dotenv.config();

const port = process.env.PORT || 8000;

if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  module.exports.handler = serverless(app);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`🚀 MockMate AI Server running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
    console.log(`📡 Health check available at: http://localhost:${port}/api/health`);
  });
}

export const handler = serverless(app);
