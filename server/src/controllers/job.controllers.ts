import { Request, Response } from "express";
import JobPostingModel from "../models/job.model";

export const createJobPosting = async (req: Request, res: Response) => {
  try {
    const { title, department, experienceLevel, requiredSkills, description, location, targetCompany } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !department || !description) {
      return res.status(400).json({ message: "Title, department, and description are required" });
    }

    const job = new JobPostingModel({
      recruiter: req.user._id,
      title,
      department,
      experienceLevel: experienceLevel || "Junior",
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      description,
      location: location || "Remote",
      targetCompany: targetCompany || req.user.companyName || "General",
      status: "active",
      applicants: [],
    });

    await job.save();

    return res.status(201).json({
      message: "Job posting created successfully",
      job,
    });
  } catch (error: any) {
    console.error("Error creating job posting:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { search, department, experienceLevel, status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    } else {
      filter.status = "active";
    }

    if (department) {
      filter.department = department;
    }

    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { requiredSkills: { $in: [new RegExp(search as string, "i")] } },
      ];
    }

    const jobs = await JobPostingModel.find(filter)
      .populate("recruiter", "name email companyName avatarUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const job = await JobPostingModel.findById(id).populate("recruiter", "name email companyName");
    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }
    return res.status(200).json(job);
  } catch (error: any) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const job = await JobPostingModel.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    const isAlreadyApplied = job.applicants.some(
      (applicantId) => applicantId.toString() === req.user?._id?.toString()
    );

    if (isAlreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this position." });
    }

    job.applicants.push(req.user._id);
    await job.save();

    return res.status(200).json({
      message: "Application submitted successfully",
      job,
    });
  } catch (error: any) {
    console.error("Error applying to job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecruiterJobs = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await JobPostingModel.find({ recruiter: req.user._id })
      .populate("applicants", "name email parsedSkills avatarUrl")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error: any) {
    console.error("Error fetching recruiter jobs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
