import db from "../config/db.js";

// =====================================================
// ADD XP (LEVEL SYSTEM)
// =====================================================
export const addXP = (req, res) => {
  const { kid_id, xp } = req.body;

  // Validation
  if (!kid_id || !xp) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Get current XP + level
  const getQuery = "SELECT xp_points, level FROM kids WHERE kid_id = ?";

  db.query(getQuery, [kid_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const currentXP = results[0].xp_points;
    const currentLevel = results[0].level;

    // Add XP
    const newXP = currentXP + xp;

    // Calculate new level
    //  Every 100 XP = level up
    const newLevel = Math.floor(newXP / 100) + 1;

    // Update DB
    const updateQuery = `
      UPDATE kids 
      SET xp_points = ?, level = ?
      WHERE kid_id = ?
    `;

    db.query(updateQuery, [newXP, newLevel, kid_id], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating XP" });
      }

      res.json({
        message: "XP updated successfully",
        xp: newXP,
        level: newLevel,
      });
    });
  });
};



// =====================================================
// GET ALL BADGES FOR A KID
// =====================================================
export const getKidBadges = (req, res) => {
  const { kidId } = req.params;

  const query = `
    SELECT b.*
    FROM kid_badges kb
    JOIN badges b ON kb.badge_id = b.badge_id
    WHERE kb.kid_id = ?
  `;

  db.query(query, [kidId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};



// =====================================================
// UNLOCK BADGE PER COURSE (CALLED FROM PROGRESS)
// =====================================================
export const unlockCourseBadge = (kid_id, course_id) => {
  // Get badge linked to this course
  const badgeQuery = `
    SELECT * FROM badges WHERE course_id = ?
  `;

  db.query(badgeQuery, [course_id], (err, badges) => {
    if (err || badges.length === 0) return;

    const badge = badges[0];

    // Check if kid already has this badge
    const checkQuery = `
      SELECT * FROM kid_badges
      WHERE kid_id = ? AND badge_id = ?
    `;

    db.query(checkQuery, [kid_id, badge.badge_id], (err, result) => {
      if (err) return;

      // If NOT already earned → give badge
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