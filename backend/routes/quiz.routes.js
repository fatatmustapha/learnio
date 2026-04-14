import express from "express";
import {
  getQuizByLesson,
  submitQuiz,
} from "../controllers/quiz.controller.js";

const router = express.Router();

// Get quiz + questions
router.get("/:lessonId", getQuizByLesson);

// Submit quiz
router.post("/submit", submitQuiz);

export default router;