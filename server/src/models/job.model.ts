import { model, Schema, Types, Document } from "mongoose";

export interface IJobPosting extends Document {
  _id: Types.ObjectId;
  recruiter: Types.ObjectId;
  title: string;
  department: string;
  experienceLevel: "Fresher" | "Junior" | "Mid-Level" | "Senior";
  requiredSkills: string[];
  description: string;
  location: string;
  targetCompany: string;
  status: "active" | "closed";
  applicants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobPostingSchema = new Schema<IJobPosting>(
  {
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ["Fresher", "Junior", "Mid-Level", "Senior"],
      required: true,
      default: "Junior",
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    targetCompany: {
      type: String,
      required: true,
      default: "General",
    },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    applicants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const JobPostingModel = model<IJobPosting>("JobPosting", jobPostingSchema);
export default JobPostingModel;
