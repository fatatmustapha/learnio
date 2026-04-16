import db from "../config/db.js";

// ===============================
// UPDATE PROGRESS
// ===============================
export const updateProgress = (req, res) => {
  const { kid_id, course_id } = req.body;

  if (!kid_id || !course_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Get total lessons in course
  const lessonQuery = "SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?";

  db.query(lessonQuery, [course_id], (err, lessonResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const totalLessons = lessonResult[0].total;

    // Check current progress
    const progressQuery = `
      SELECT * FROM progress WHERE kid_id = ? AND course_id = ?
    `;

    db.query(progressQuery, [kid_id, course_id], (err, progressResult) => {
      if (err) return res.status(500).json({ message: "Database error" });

      let completedLessons = 1;

      if (progressResult.length > 0) {
        completedLessons = progressResult[0].completed_lessons + 1;
      }

      // Calculate percentage
      const percentage = (completedLessons / totalLessons) * 100;
      const completed = percentage >= 100;

      // Insert or update
      const upsertQuery = `
        INSERT INTO progress (kid_id, course_id, completed_lessons, progress_percent, completed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          completed_lessons = ?,
          progress_percent = ?,
          completed = ?
      `;

      db.query(
        upsertQuery,
        [
          kid_id,
          course_id,
          completedLessons,
          percentage,
          completed,
          completedLessons,
          percentage,
          completed,
        ],
        (err) => {
          if (err) return res.status(500).json({ message: "Error updating progress" });

          res.json({
            message: "Progress updated",
            completedLessons,
            percentage,
            completed,
          });
        }
      );
    });
  });
};

// ===============================
// GET PROGRESS
// ===============================
export const getKidProgress = (req, res) => {
  const { kidId } = req.params;

  const query = `
    SELECT p.*, c.title
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
};