import db from "../config/db.js";

export const getKidProfile = async (req, res) => {
  const kidId = req.user.id;

  try {
    const [rows] = await db.query(
      `
      SELECT kid_id, child_name, username, age, xp_points, level
      FROM kids
      WHERE kid_id = ?
      `,
      [kidId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kid not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET KID PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getKidDashboard = async (req, res) => {
  const kidId = req.user.id;

  try {
    const [kidRows] = await db.query(
      `
      SELECT kid_id, child_name, username, age, xp_points
      FROM kids
      WHERE kid_id = ?
      `,
      [kidId]
    );

    if (kidRows.length === 0) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const kid = kidRows[0];
    const totalXp = kid.xp_points || 0;
    const level = Math.floor(totalXp / 50) + 1;
    const levelProgress = totalXp % 50;

    const [courses] = await db.query(
      `
      SELECT 
        c.course_id,
        c.title,
        c.description,
        c.image_url,
        c.badge_icon,
        p.completed_lessons,
        p.progress_percent,
        p.completed
      FROM progress p
      JOIN courses c ON p.course_id = c.course_id
      WHERE p.kid_id = ?
      ORDER BY c.course_id ASC
      `,
      [kidId]
    );

    res.json({
      kid: {
        kid_id: kid.kid_id,
        child_name: kid.child_name,
        username: kid.username,
        age: kid.age,
        totalXp,
        level,
        levelProgress,
        xpNeededForNextLevel: 50,
      },
      stats: {
        enrolledCourses: courses.length,
        completedCourses: courses.filter((course) => course.completed === 1).length,
      },
      courses,
    });
  } catch (error) {
    console.error("GET KID DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getKidAchievements = async (req, res) => {
  const kidId = req.user.id;

  try {
    const [kidRows] = await db.query(
      `
      SELECT kid_id, child_name, username, xp_points
      FROM kids
      WHERE kid_id = ?
      `,
      [kidId]
    );

    if (kidRows.length === 0) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const kid = kidRows[0];

    const [badges] = await db.query(
      `
      SELECT
        c.course_id,
        c.title AS course_title,
        c.badge_icon,
        COALESCE(p.completed, 0) AS unlocked,
        COALESCE(p.progress_percent, 0) AS progress_percent
      FROM courses c
      LEFT JOIN progress p
        ON c.course_id = p.course_id
        AND p.kid_id = ?
      ORDER BY c.course_id ASC
      `,
      [kidId]
    );

    const unlockedCount = badges.filter((badge) => badge.unlocked === 1).length;

    res.json({
      kid: {
        kid_id: kid.kid_id,
        child_name: kid.child_name,
        username: kid.username,
        xp_points: kid.xp_points || 0,
      },
      stats: {
        totalBadges: badges.length,
        unlockedBadges: unlockedCount,
      },
      badges,
    });
  } catch (error) {
    console.error("GET KID ACHIEVEMENTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};