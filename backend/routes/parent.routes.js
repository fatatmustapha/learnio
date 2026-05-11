import express from "express";

import {
  getParentDashboard,
  addChild,
  getKidsByParent,
  getParentAchievements,
  resetKidPin,
} from "../controllers/parent.controller.js";

import {
  verifyToken,
  verifyRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard/:parentId",
  verifyToken,
  verifyRole("parent"),
  getParentDashboard
);

router.post(
  "/add-child",
  verifyToken,
  verifyRole("parent"),
  addChild
);

router.get(
  "/kids/:parentId",
  verifyToken,
  verifyRole("parent"),
  getKidsByParent
);

router.get(
  "/achievements/:parentId",
  verifyToken,
  verifyRole("parent"),
  getParentAchievements
);

router.put(
  "/reset-pin",
  verifyToken,
  verifyRole("parent"),
  resetKidPin
);

export default router;