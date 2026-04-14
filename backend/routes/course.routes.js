import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

// GET all courses
router.get("/", getAllCourses);

// GET one course + lessons
router.get("/:id", getCourseById);

// CREATE course (admin)
router.post("/", createCourse);

export default router;