import db from "../config/db.js";
import { unlockCourseBadge } from "./gamification.controller.js";

// ===============================
// UPDATE PROGRESS
// ===============================
export const updateProgress = (req, res) => {
  const { kid_id, course_id } = req.body;

  if (!kid_id || !course_id) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Get total lessons
  const lessonQuery =
    "SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?";

  db.query(lessonQuery, [course_id], (err, lessonResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const totalLessons = lessonResult[0].total;

    // Get current progress
    const progressQuery = `
      SELECT * FROM progress WHERE kid_id = ? AND course_id = ?
    `;

    db.query(progressQuery, [kid_id, course_id], (err, progressResult) => {
      if (err) return res.status(500).json({ message: "Database error" });

      let completedLessons = 1;

      if (progressResult.length > 0) {
        completedLessons = progressResult[0].completed_lessons + 1;
      }
      if (completed) {
        unlockCourseBadge(kid_id, course_id);
      }

      // Calculate %
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
          if (err)
            return res.status(500).json({ message: "Error updating progress" });

          // IMPORTANT: Unlock badge ONLY if course completed
          if (completed) {
            unlockCourseBadge(kid_id, course_id);
          }

          res.json({
            message: "Progress updated",
            completedLessons,
            percentage,
            completed,
          });
        },
      );
    });
  });
}
// ===============================
// UNLOCK BADGE PER COURSE
// ===============================
const unlockCourseBadge = (kid_id, course_id) => {
  // Get badge for this course
  const badgeQuery = `
    SELECT * FROM badges WHERE course_id = ?
  `;

  db.query(badgeQuery, [course_id], (err, badges) => {
    if (err || badges.length === 0) return;

    const badge = badges[0];

    // Check if already earned
    const checkQuery = `
      SELECT * FROM kid_badges
      WHERE kid_id = ? AND badge_id = ?
    `;

    db.query(checkQuery, [kid_id, badge.badge_id], (err, result) => {
      if (err) return;

      // If NOT earned → insert
      if (result.length === 0) {
        const insertQuery = `
          INSERT INTO kid_badges (kid_id, badge_id)
          VALUES (?, ?)
        `;

        db.query(insertQuery, [kid_id, badge.badge_id]);
      }
    });
  });
};
