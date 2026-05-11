import db from "../config/db.js";
import bcrypt from "bcrypt";

export const getParentDashboard = async (req, res) => {
  const { parentId } = req.params;

  try {
    const [parentRows] = await db.query(
      "SELECT parent_id, name, email FROM parents WHERE parent_id = ?",
      [parentId]
    );

    if (parentRows.length === 0) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const parent = parentRows[0];

    const [kids] = await db.query(
      `
      SELECT 
        k.kid_id,
        k.child_name,
        k.username,
        k.age,
        k.level,
        k.xp_points,
        COUNT(p.course_id) AS assignedCourses
      FROM kids k
      LEFT JOIN progress p ON k.kid_id = p.kid_id
      WHERE k.parent_id = ?
      GROUP BY 
        k.kid_id,
        k.child_name,
        k.username,
        k.age,
        k.level,
        k.xp_points
      `,
      [parentId]
    );

    const [coursesCountRows] = await db.query(
      "SELECT COUNT(*) AS totalCourses FROM courses"
    );

    const totalCourses = coursesCountRows[0].totalCourses || 0;
    const totalXpPerKid = totalCourses * 50;

    const [completedRows] = await db.query(
      `
      SELECT COALESCE(SUM(completed_lessons), 0) AS totalCompletedLessons
      FROM progress
      WHERE kid_id IN (
        SELECT kid_id FROM kids WHERE parent_id = ?
      )
      `,
      [parentId]
    );

    const totalCompletedLessons = completedRows[0].totalCompletedLessons || 0;

    const formattedKids = kids.map((kid) => ({
      kid_id: kid.kid_id,
      child_name: kid.child_name,
      username: kid.username,
      age: kid.age,
      level: kid.level || 1,
      earnedXp: kid.xp_points || 0,
      totalXp: totalXpPerKid,
      assignedCourses: Number(kid.assignedCourses) || 0,
    }));

    res.json({
      parent: {
        parent_id: parent.parent_id,
        name: parent.name,
        email: parent.email,
      },
      stats: {
        childrenCount: kids.length,
        completedLessons: totalCompletedLessons,
      },
      kids: formattedKids,
    });
  } catch (error) {
    console.error("PARENT DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addChild = async (req, res) => {
  const { parent_id, child_name, username, age, pin } = req.body;

  if (!parent_id || !child_name || !username || !age || !pin) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * FROM kids WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    await db.query(
      `
      INSERT INTO kids
      (parent_id, child_name, username, pin_hash, age)
      VALUES (?, ?, ?, ?, ?)
      `,
      [parent_id, child_name, username, hashedPin, age]
    );

    res.json({
      message: "Child added successfully",
    });
  } catch (error) {
    console.error("ADD CHILD ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getKidsByParent = async (req, res) => {
  const { parentId } = req.params;

  try {
    const [kids] = await db.query(
      `
      SELECT kid_id, child_name, username, age, level, xp_points
      FROM kids
      WHERE parent_id = ?
      `,
      [parentId]
    );

    res.json(kids);
  } catch (error) {
    console.error("GET KIDS ERROR:", error);
    res.status(500).json({ message: "Database error" });
  }
};

export const getParentAchievements = async (req, res) => {
  const { parentId } = req.params;

  try {
    const [kids] = await db.query(
      `
      SELECT kid_id, child_name, username, xp_points
      FROM kids
      WHERE parent_id = ?
      ORDER BY kid_id ASC
      `,
      [parentId]
    );

    const childrenAchievements = [];

    for (const kid of kids) {
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
        [kid.kid_id]
      );

      const unlockedCount = badges.filter((badge) => badge.unlocked === 1).length;

      childrenAchievements.push({
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
    }

    res.json({
      children: childrenAchievements,
    });
  } catch (error) {
    console.error("GET PARENT ACHIEVEMENTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetKidPin = async (req, res) => {
  const { kid_id, newPin } = req.body;

  if (!kid_id || !newPin) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const hashedPin = await bcrypt.hash(newPin, 10);

    await db.query(
      `
      UPDATE kids
      SET pin_hash = ?
      WHERE kid_id = ?
      `,
      [hashedPin, kid_id]
    );

    res.json({
      message: "PIN reset successfully",
    });
  } catch (error) {
    console.error("RESET PIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};