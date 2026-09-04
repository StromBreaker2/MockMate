import { model, Schema, Types } from "mongoose";
import MockInterviewModel, { MockInterview } from "./mockinterview.model";

export type UserRole = "candidate" | "recruiter" | "admin";

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  email?: string;
  password?: string;
  role: UserRole;
  companyName?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  parsedSkills?: string[];
  isActive: boolean;
  firebaseUID?: string;
  interviewList: MockInterview[] | Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    firebaseUID: {
      type: Schema.Types.String,
      required: false,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
      required: true,
    },
    companyName: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    headline: {
      type: Schema.Types.String,
      required: false,
    },
    bio: {
      type: Schema.Types.String,
      required: false,
    },
    avatarUrl: {
      type: Schema.Types.String,
      required: false,
    },
    resumeUrl: {
      type: Schema.Types.String,
      required: false,
    },
    parsedSkills: {
      type: [Schema.Types.String],
      default: [],
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    interviewList: [
      {
        type: Schema.Types.ObjectId,
        ref: "MockInterview",
      },
    ],
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", userSchema);

