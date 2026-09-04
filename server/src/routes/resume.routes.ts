import { Router } from "express";
import multer from "multer";
import { uploadResume, getCandidateResume, evaluateATS } from "../controllers/resume.controllers";
import { asyncHandler } from "../utils/asyncHandler";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are supported for resume parsing"));
    }
  },
});

router.post(
  "/upload",
  asyncHandler(authMiddleware),
  upload.single("resume"),
  asyncHandler(uploadResume)
);

router.get("/me", asyncHandler(authMiddleware), asyncHandler(getCandidateResume));

router.post("/evaluate-ats", asyncHandler(authMiddleware), asyncHandler(evaluateATS));

export default router;
