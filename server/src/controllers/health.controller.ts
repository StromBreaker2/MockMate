import { Request, Response } from "express";
import mongoose from "mongoose";

export const healthCheck = async (req: Request, res: Response) => {
    try {
        const dbState = mongoose.connection.readyState;
        const isDBConnected = dbState === 1 ? "connected" : "disconnected";

        res.status(200).json({
            success: true,
            status: "OK",
            message: "Server is running",
            database: isDBConnected,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Health check failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
