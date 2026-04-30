import db from "../config/db.js";

// ===============================
// GET ALL COURSES
// ===============================
export const getAllCourses = (req, res) => {
  const sql = `
    SELECT 
      course_id,
      title,
      description,
      course_image,
      category_id   
    FROM courses
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("COURSES:", results); // 🔥 DEBUG

    res.json(results);
  });
};