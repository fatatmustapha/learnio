import express from "express";

import {
  getKidProfile,
  getKidDashboard,
  getKidAchievements,
} from "../controllers/kid.controller.js";

import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, verifyRole("kid"), getKidProfile);

router.get("/dashboard", verifyToken, verifyRole("kid"), getKidDashboard);

router.get("/achievements", verifyToken, verifyRole("kid"), getKidAchievements);

export default router;