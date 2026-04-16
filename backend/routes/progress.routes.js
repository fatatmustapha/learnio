import express from "express";
import {
  updateProgress,
  getKidProgress,
} from "../controllers/progress.controller.js";

const router = express.Router();

// Update progress
router.post("/update", updateProgress);

// Get progress for kid
router.get("/:kidId", getKidProgress);

export default router;
