import express from "express";
import {
  getKidsByParent,
  getKidProgressForParent,
  resetKidPin,
} from "../controllers/parent.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/kids/:parentId", verifyToken, verifyRole("parent"), getKidsByParent);

router.get("/progress/:kidId", verifyToken, verifyRole("parent"), getKidProgressForParent);

router.put("/reset-pin", verifyToken, verifyRole("parent"), resetKidPin);
export default router;