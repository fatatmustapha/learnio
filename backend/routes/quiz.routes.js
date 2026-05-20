import express from "express";

import {
  getQuizByChapter,
  submitQuiz,
  getCourseQuizStatus,
} from "../controllers/quiz.controller.js";

import {
  verifyToken,
  verifyRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/chapter/:chapterId",
  verifyToken,
  verifyRole("kid"),
  getQuizByChapter
);

router.get(
  "/course-status/:courseId",
  verifyToken,
  verifyRole("kid"),
  getCourseQuizStatus
);

router.post(
  "/submit",
  verifyToken,
  verifyRole("kid"),
  submitQuiz
);

export default router;