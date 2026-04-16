import express from "express";
import {
  createCourseAdmin,
  updateCourse, 
  createLesson,
  createQuiz,
  createQuestion,
  getAllCoursesAdmin,
} from "../controllers/admin.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/course", verifyToken, verifyRole("admin"), createCourseAdmin);

router.put("/course/:id", verifyToken, verifyRole("admin"), updateCourse);

router.get("/courses", verifyToken, verifyRole("admin"), getAllCoursesAdmin);

router.post("/lesson", verifyToken, verifyRole("admin"), createLesson);

router.post("/quiz", verifyToken, verifyRole("admin"), createQuiz);

router.post("/question", verifyToken, verifyRole("admin"), createQuestion);
export default router;