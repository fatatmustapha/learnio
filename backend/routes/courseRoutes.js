const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET FEATURED COURSES
router.get("/featured", (req, res) => {
  const query = `
    SELECT course_id, title, description, course_image, xp_reward
    FROM courses
    WHERE is_featured = TRUE
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
});

module.exports = router;