import express from "express";
import {
  registerParent,
  loginParent,
  loginKid,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerParent);
router.post("/login", loginParent);
router.post("/kid-login", loginKid);

export default router;