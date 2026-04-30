import express from "express";
import { getAllCourses } from "../controllers/course.controller.js";

const router = express.Router();

//////////////////////////////////////////////////////
// GET ALL COURSES (USES CONTROLLER)
//////////////////////////////////////////////////////
router.get("/", getAllCourses);

export default router;