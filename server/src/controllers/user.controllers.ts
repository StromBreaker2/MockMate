import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserModel, UserRole } from "../models/user.model";
import { validationResult } from "express-validator";
import admin from "../firebase/firebase";

const sanitizeUser = (user: any) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "candidate",
    companyName: user.companyName,
    headline: user.headline,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    resumeUrl: user.resumeUrl,
    parsedSkills: user.parsedSkills || [],
    createdAt: user.createdAt,
  };
};

export const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not Authorized" });
    }
    return res.status(200).json(sanitizeUser(req.user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, firebaseUID, role, companyName, headline, adminSecret } = req.body;
  try {
    if (!name || !email || !(firebaseUID || password)) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    let user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Determine role (protect admin role creation)
    let assignedRole: UserRole = "candidate";
    if (role === "recruiter") {
      assignedRole = "recruiter";
    } else if (role === "admin") {
      if (process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
        assignedRole = "admin";
      } else {
        return res.status(403).json({ error: "Unauthorized to register as admin" });
      }
    }

    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      firebaseUID: firebaseUID || null,
      role: assignedRole,
      companyName: assignedRole === "recruiter" ? companyName : undefined,
      headline: headline || (assignedRole === "recruiter" ? "Recruiter / Talent Partner" : "Candidate / Aspiring Engineer"),
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, firebaseUID } = req.body;

    if (firebaseUID) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseUID);
        if (!decodedToken?.email) {
          return res.status(400).json({ message: "Invalid Firebase credentials" });
        }

        const user = await UserModel.findOne({ email: decodedToken.email });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return generateAndSendToken(res, user);
      } catch (error) {
        console.error("Error in Firebase authentication:", error);
        return res.status(400).json({ message: "Invalid Firebase credentials" });
      }
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return generateAndSendToken(res, user);
  } catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logOutUser = async (req: Request, res: Response): Promise<Response> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

const generateAndSendToken = (res: Response, user: any): Response => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const payload = { user: { id: user._id, role: user.role } };

  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "User logged in successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("JWT Sign Error:", err);
    return res.status(500).json({ message: "Token generation failed" });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { name, companyName, headline, bio, avatarUrl, parsedSkills } = req.body;
  try {
    let user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (companyName !== undefined) user.companyName = companyName;
    if (headline !== undefined) user.headline = headline;
    if (bio !== undefined) user.bio = bio;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    if (parsedSkills && Array.isArray(parsedSkills)) user.parsedSkills = parsedSkills;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

