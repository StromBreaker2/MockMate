import { model, Schema, Types, Document } from "mongoose";

export interface IResume extends Document {
  _id: Types.ObjectId;
  candidate: Types.ObjectId;
  originalFileName: string;
  fileUrl?: string;
  rawText: string;
  parsedData: {
    fullName?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills: string[];
    experienceYears?: number;
    education?: Array<{
      degree?: string;
      institution?: string;
      year?: string;
    }>;
    workHistory?: Array<{
      title?: string;
      company?: string;
      duration?: string;
      description?: string;
    }>;
    projects?: Array<{
      name?: string;
      description?: string;
      techStack?: string[];
      link?: string;
    }>;
    certifications?: string[];
  };
  atsEvaluations: Array<{
    jobId?: Types.ObjectId;
    jobTitle: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    evaluatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    rawText: {
      type: String,
      required: true,
    },
    parsedData: {
      fullName: String,
      email: String,
      phone: String,
      summary: String,
      skills: {
        type: [String],
        default: [],
      },
      experienceYears: Number,
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      workHistory: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],
          link: String,
        },
      ],
      certifications: [String],
    },
    atsEvaluations: [
      {
        jobId: {
          type: Schema.Types.ObjectId,
          ref: "JobPosting",
        },
        jobTitle: {
          type: String,
          required: true,
        },
        matchScore: {
          type: Number,
          required: true,
        },
        matchedSkills: [String],
        missingSkills: [String],
        recommendations: [String],
        evaluatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const ResumeModel = model<IResume>("Resume", resumeSchema);
export default ResumeModel;
