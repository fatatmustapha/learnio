import express from "express";

import {
  getCourses,
  getCourseDetails,
  enrollCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id/details", getCourseDetails);
router.post("/enroll", enrollCourse);

export default router;