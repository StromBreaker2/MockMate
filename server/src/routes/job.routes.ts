import { Router } from "express";
import {
  createJobPosting,
  getAllJobs,
  getJobById,
  applyToJob,
  getRecruiterJobs,
} from "../controllers/job.controllers";
import { asyncHandler } from "../utils/asyncHandler";
import authMiddleware, { requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", asyncHandler(getAllJobs));
router.get(
  "/recruiter",
  asyncHandler(authMiddleware),
  requireRole("recruiter", "admin"),
  asyncHandler(getRecruiterJobs)
);
router.get(
  "/recruiter/my-postings",
  asyncHandler(authMiddleware),
  requireRole("recruiter", "admin"),
  asyncHandler(getRecruiterJobs)
);
router.get("/:id", asyncHandler(getJobById));
router.post(
  "/",
  asyncHandler(authMiddleware),
  requireRole("recruiter", "admin"),
  asyncHandler(createJobPosting)
);
router.post("/:id/apply", asyncHandler(authMiddleware), asyncHandler(applyToJob));

export default router;
