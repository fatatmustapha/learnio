import express from "express";
import {
  registerParent,
  loginParent,
  loginKid,
  forgotPassword,
  forgotPin
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerParent);
router.post("/login-parent", loginParent);
router.post("/login-kid", loginKid);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-pin", forgotPin);

export default router;