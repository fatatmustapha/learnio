import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sql = "SELECT category_id, category_name FROM categories";

    const [results] = await db.query(sql); // ✅ correct for mysql2

    res.json(results);
  } catch (err) {
    console.error("Categories error:", err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

export default router;