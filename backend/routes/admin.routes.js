import express from "express";
import {
  createCourseAdmin,
  createLesson,
  createQuiz,
  createQuestion,
  getAllCoursesAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Courses
router.post("/course", createCourseAdmin);
router.get("/courses", getAllCoursesAdmin);

// Lessons
router.post("/lesson", createLesson);

// Quiz
router.post("/quiz", createQuiz);

// Questions
router.post("/question", createQuestion);

export default router;