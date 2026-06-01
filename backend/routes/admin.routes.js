import multer from "multer";
import path from "path";

import express from "express";

import {
  getDashboardStats,
  getAllCoursesAdmin,
  deleteLessonAdmin,
  deleteQuizAdmin,
  deleteChapterAdmin,
  deleteCourseAdmin,
  updateChapterAdmin,
  updateLessonAdmin,
  updateQuizAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);
router.get("/courses", getAllCoursesAdmin);

router.delete("/courses/:courseId", deleteCourseAdmin);
router.delete("/chapters/:chapterId", deleteChapterAdmin);
router.delete("/lessons/:lessonId", deleteLessonAdmin);
router.delete("/quizzes/:quizId", deleteQuizAdmin);

router.put("/chapters/:chapterId", updateChapterAdmin);
router.put("/lessons/:lessonId", updateLessonAdmin);
router.put("/quizzes/:quizId", updateQuizAdmin);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload-image", upload.single("image"), (req, res) => {
  res.json({
    image_url: `/uploads/${req.file.filename}`,
  });
});

export default router;