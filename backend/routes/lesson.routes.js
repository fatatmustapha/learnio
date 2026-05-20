import express from "express";

import {
  getLessonById,
  completeLesson,
} from "../controllers/lesson.controller.js";

import {
  verifyToken,
  verifyRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:lessonId", verifyToken, verifyRole("kid"), getLessonById);

router.post(
  "/:lessonId/complete",
  verifyToken,
  verifyRole("kid"),
  completeLesson
);

export default router;