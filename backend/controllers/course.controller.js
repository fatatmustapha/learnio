import db from "../config/db.js";

// ===============================
// GET ALL COURSES
// ===============================
export const getAllCourses = (req, res) => {
  const query = "SELECT * FROM courses";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
};

// ===============================
// GET COURSE + LESSONS
// ===============================
export const getCourseById = (req, res) => {
  const { id } = req.params;

  // First: get course
  const courseQuery = "SELECT * FROM courses WHERE course_id = ?";

  db.query(courseQuery, [id], (err, courseResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (courseResults.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = courseResults[0];

    // Second: get lessons for this course
    const lessonQuery = "SELECT * FROM lessons WHERE course_id = ?";

    db.query(lessonQuery, [id], (err, lessonResults) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // Combine course + lessons
      res.json({
        ...course,
        lessons: lessonResults,
      });
    });
  });
};

// ===============================
// CREATE COURSE
// ===============================
export const createCourse = (req, res) => {
  const { title, description, category, xp_reward } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description required" });
  }

  const query = `
    INSERT INTO courses (title, description, category, xp_reward)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [title, description, category, xp_reward], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error creating course" });
    }

    res.json({ message: "Course created successfully" });
  });
};