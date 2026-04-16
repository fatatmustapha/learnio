import db from "../config/db.js";
import bcrypt from "bcrypt";

// ===============================
// GET KIDS BY PARENT
// ===============================
export const getKidsByParent = (req, res) => {
  const { parentId } = req.params;

  const query = "SELECT kid_id, username, age, level, xp_points FROM kids WHERE parent_id = ?";

  db.query(query, [parentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
}
// ===============================
// GET PROGRESS FOR PARENT
// ===============================
export const getKidProgressForParent = (req, res) => {
  const { kidId } = req.params;

  const query = `
    SELECT c.title, p.completed_lessons, p.progress_percent, p.completed
    FROM progress p
    JOIN courses c ON p.course_id = c.course_id
    WHERE p.kid_id = ?
  `;

  db.query(query, [kidId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
}
// ===============================
// 🔐 RESET KID PIN
// ===============================
export const resetKidPin = async (req, res) => {
  const { kid_id, newPin } = req.body;

  if (!kid_id || !newPin) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    // 🔐 Hash PIN
    const hashedPin = await bcrypt.hash(newPin, 10);

    const query = `
      UPDATE kids SET pin_hash = ?
      WHERE kid_id = ?
    `;

    db.query(query, [hashedPin, kid_id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating PIN" });
      }

      res.json({ message: "PIN reset successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};