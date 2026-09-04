import { Request, Response } from "express";
import MockInterviewModel from "../models/mockinterview.model";
import User from "../models/user.model";

import mongoose from "mongoose";

// Create a new mock interview
export const createMockInterview = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const {
      jobRole,
      overallReview,
      overallRating,
      experienceLevel,
      targetCompany,
      skills,
      dsaQuestions,
      technicalQuestions,
      coreSubjectQuestions,
    } = req.body;

    const newMockInterview = new MockInterviewModel({
      user: userId,
      jobRole: jobRole || "Software Engineer",
      overallReview: overallReview || "",
      overallRating: typeof overallRating === "number" ? overallRating : 0,
      experienceLevel: experienceLevel || "Mid-Level",
      targetCompany: targetCompany || "Enterprise",
      skills: Array.isArray(skills) ? skills : [],
      dsaQuestions: Array.isArray(dsaQuestions) ? dsaQuestions : [],
      technicalQuestions: Array.isArray(technicalQuestions) ? technicalQuestions : [],
      coreSubjectQuestions: Array.isArray(coreSubjectQuestions) ? coreSubjectQuestions : [],
    });

    const savedMockInterview = await newMockInterview.save();
    return res.status(201).json(savedMockInterview);
  } catch (error: any) {
    console.error("Error creating mock interview:", error);
    return res.status(500).json({ message: error.message || "Failed to create mock interview" });
  }
};

// Delete a mock interview
export const deleteMockInterview = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const mockInterview = await MockInterviewModel.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found" });
    }

    return res.status(200).json({ message: "Mock interview deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting mock interview:", error);
    return res.status(500).json({ message: error.message || "Failed to delete mock interview" });
  }
};

// Edit a mock interview
export const editMockInterview = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const updates = req.body;

    const mockInterview = await MockInterviewModel.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true }
    );

    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found" });
    }

    return res.status(200).json(mockInterview);
  } catch (error: any) {
    console.error("Error editing mock interview:", error);
    return res.status(500).json({ message: error.message || "Failed to edit mock interview" });
  }
};

// Get all mock interviews for a user
export const getMockInterviews = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const mockInterviews = await MockInterviewModel.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json(mockInterviews);
  } catch (error: any) {
    console.error("Error getting mock interviews:", error);
    return res.status(500).json({ message: error.message || "Failed to get mock interviews" });
  }
};

// Get a single mock interview by ID
export const getMockInterviewById = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID format" });
    }

    const mockInterview = await MockInterviewModel.findOne({
      _id: id,
      user: userId,
    });

    if (!mockInterview) {
      return res.status(404).json({ message: "Mock interview not found" });
    }

    return res.status(200).json(mockInterview);
  } catch (error: any) {
    console.error("Error getting mock interview by ID:", error);
    return res.status(500).json({ message: error.message || "Failed to get mock interview" });
  }
};
