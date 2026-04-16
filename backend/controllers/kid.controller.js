import db from "../config/db.js";

// ===============================
// GET KID PROFILE
// ===============================
export const getKidProfile = (req, res) => {
  const kidId = req.user.id;

  const query = `
    SELECT kid_id, username, age, xp_points, level
    FROM kids
    WHERE kid_id = ?
  `;

  db.query(query, [kidId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results[0]);
  });
};


// ===============================
// GET KID DASHBOARD
// ===============================
export const getKidDashboard = (req, res) => {
  const kidId = req.user.id;

  const query = `
    SELECT 
      k.username,
      k.xp_points,
      k.level,
      COUNT(p.course_id) AS courses_started,
      SUM(p.completed) AS courses_completed
    FROM kids k
    LEFT JOIN progress p ON k.kid_id = p.kid_id
    WHERE k.kid_id = ?
    GROUP BY k.kid_id
  `;

  db.query(query, [kidId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results[0]);
  });
};