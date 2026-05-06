import express from "express";

import {
  getCourses,
  getCourseDetails,
} from "../controllers/course.controller.js";

const router = express.Router();

// GET ALL COURSES
router.get("/", getCourses);

// GET COURSE DETAILS
router.get("/:id/details", getCourseDetails);

export default router;