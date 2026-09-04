import { Request, Response } from "express";
import ResumeModel from "../models/resume.model";
import JobPostingModel from "../models/job.model";
import { UserModel } from "../models/user.model";
import { extractTextFromPdf, parseResumeWithAI } from "../services/resumeParser.service";
import { calculateATSScore } from "../services/atsScorer.service";

export const uploadResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume file" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const fileBuffer = req.file.buffer;
    const originalFileName = req.file.originalname;

    // 1. Extract raw text from PDF
    const rawText = await extractTextFromPdf(fileBuffer);
    if (!rawText.trim()) {
      return res.status(400).json({ message: "Could not read text from uploaded PDF. Ensure it is not an image-only scan." });
    }

    // 2. Parse using AI
    const parsedData = await parseResumeWithAI(rawText);

    // 3. Upsert resume record in DB
    let resume = await ResumeModel.findOne({ candidate: req.user._id });
    if (resume) {
      resume.originalFileName = originalFileName;
      resume.rawText = rawText;
      resume.parsedData = parsedData;
      await resume.save();
    } else {
      resume = new ResumeModel({
        candidate: req.user._id,
        originalFileName,
        rawText,
        parsedData,
        atsEvaluations: [],
      });
      await resume.save();
    }

    // 4. Update user's parsed skills in User model
    if (parsedData.skills && parsedData.skills.length > 0) {
      await UserModel.findByIdAndUpdate(req.user._id, {
        parsedSkills: parsedData.skills,
      });
    }

    return res.status(200).json({
      message: "Resume uploaded and parsed successfully",
      resume,
    });
  } catch (error: any) {
    console.error("Error uploading resume:", error);
    return res.status(500).json({ message: error.message || "Failed to process resume" });
  }
};

export const getCandidateResume = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resume = await ResumeModel.findOne({ candidate: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: "No resume found. Please upload one." });
    }

    return res.status(200).json(resume);
  } catch (error: any) {
    console.error("Error getting resume:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const evaluateATS = async (req: Request, res: Response) => {
  try {
    const { jobId, jobTitle, description, requiredSkills } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resume = await ResumeModel.findOne({ candidate: req.user._id });
    if (!resume) {
      return res.status(400).json({ message: "Please upload your resume first before calculating ATS score." });
    }

    let targetTitle = jobTitle || "Target Position";
    let targetDesc = description || "";
    let targetSkills = requiredSkills || [];

    // If jobId is supplied, fetch details from JobPostingModel
    if (jobId) {
      const job = await JobPostingModel.findById(jobId);
      if (job) {
        targetTitle = job.title;
        targetDesc = job.description;
        targetSkills = job.requiredSkills;
      }
    }

    if (!targetDesc && targetSkills.length === 0) {
      return res.status(400).json({ message: "Job description or required skills are required." });
    }

    const evaluation = await calculateATSScore(
      resume.parsedData,
      resume.rawText,
      targetTitle,
      targetDesc,
      targetSkills
    );

    // Save evaluation record into candidate resume history
    resume.atsEvaluations.unshift({
      jobId: jobId ? jobId : undefined,
      jobTitle: targetTitle,
      matchScore: evaluation.matchScore,
      matchedSkills: evaluation.matchedSkills,
      missingSkills: evaluation.missingSkills,
      recommendations: evaluation.recommendations,
      evaluatedAt: new Date(),
    });

    // Keep last 15 evaluations
    if (resume.atsEvaluations.length > 15) {
      resume.atsEvaluations = resume.atsEvaluations.slice(0, 15);
    }

    await resume.save();

    return res.status(200).json({
      message: "ATS evaluation completed successfully",
      evaluation,
    });
  } catch (error: any) {
    console.error("Error evaluating ATS:", error);
    return res.status(500).json({ message: "Failed to evaluate ATS match" });
  }
};
