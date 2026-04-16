import express from "express";
import {
  getKidsByParent,
  getKidProgressForParent,
  resetKidPin,
} from "../controllers/parent.controller.js";

const router = express.Router();

// Get all kids
router.get("/kids/:parentId", getKidsByParent);

// Get kid progress
router.get("/progress/:kidId", getKidProgressForParent);

// Reset PIN
router.put("/reset-pin", resetKidPin);

export default router;