import {
  GenerateIntervieQuestions,
  GenerateReview,
  handleAdaptiveFollowUp,
  handleDomainQuestions,
} from "../controllers/gemini.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { Router } from "express";
const router = Router();

router.post(
  "/generatequestions",
  asyncHandler(authMiddleware),
  asyncHandler(GenerateIntervieQuestions)
);

router.post(
  "/generatereview",
  asyncHandler(authMiddleware),
  asyncHandler(GenerateReview)
);

router.post(
  "/adaptive-followup",
  asyncHandler(authMiddleware),
  asyncHandler(handleAdaptiveFollowUp)
);

router.post(
  "/domain-questions",
  asyncHandler(authMiddleware),
  asyncHandler(handleDomainQuestions)
);

export default router;

