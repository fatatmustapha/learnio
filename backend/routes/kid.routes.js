import express from "express";
import {
  getKidProfile,
  getKidDashboard,
} from "../controllers/kid.controller.js";

import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const router = express.Router();

// Kid profile
router.get("/profile", verifyToken, verifyRole("kid"), getKidProfile);

// Kid dashboard
router.get("/dashboard", verifyToken, verifyRole("kid"), getKidDashboard);

export default router;