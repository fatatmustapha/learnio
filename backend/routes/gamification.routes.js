import express from "express";
import {
  addXP,
  getKidBadges,
} from "../controllers/gamification.controller.js";

const router = express.Router();

// Add XP
router.post("/add-xp", addXP);

// Get badges
router.get("/badges/:kidId", getKidBadges);

export default router;