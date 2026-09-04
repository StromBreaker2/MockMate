import {
  GenerateIntervieQuestions,
  GenerateReview,
  handleAdaptiveFollowUp,
  handleDomainQuestions,
  handleRAGContext,
  handleWhisperTranscribe,
  handleSendReportEmail,
  handleEvaluateSystemDesign,
  handleOptimizeResume,
  handleSalaryNegotiation,
} from "../controllers/gemini.controllers";
import authMiddleware from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { Router } from "express";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max audio
});

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

router.post(
  "/rag-context",
  asyncHandler(authMiddleware),
  asyncHandler(handleRAGContext)
);

router.post(
  "/whisper-transcribe",
  asyncHandler(authMiddleware),
  upload.single("audio"),
  asyncHandler(handleWhisperTranscribe)
);

router.post(
  "/send-email-report",
  asyncHandler(authMiddleware),
  asyncHandler(handleSendReportEmail)
);

router.post(
  "/evaluate-system-design",
  asyncHandler(authMiddleware),
  asyncHandler(handleEvaluateSystemDesign)
);

router.post(
  "/optimize-resume",
  asyncHandler(authMiddleware),
  asyncHandler(handleOptimizeResume)
);

router.post(
  "/salary-negotiate",
  asyncHandler(authMiddleware),
  asyncHandler(handleSalaryNegotiation)
);

export default router;
