import db from "../config/db.js";

// ===============================
// CREATE COURSE
// ===============================
export const createCourseAdmin = (req, res) => {
  const { title, description, category, xp_reward } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Missing data" });
  }

  const query = `
    INSERT INTO courses (title, description, category, xp_reward)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [title, description, category, xp_reward], (err) => {
    if (err) return res.status(500).json({ message: "Error creating course" });

    res.json({ message: "Course created successfully" });
  });
}
// ===============================
// CREATE LESSON
// ===============================
export const createLesson = (req, res) => {
  const { course_id, title, content, lesson_order, xp_reward } = req.body;

  if (!course_id || !title) {
    return res.status(400).json({ message: "Missing data" });
  }

  const query = `
    INSERT INTO lessons (course_id, title, content, lesson_order, xp_reward)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [course_id, title, content, lesson_order, xp_reward], (err) => {
    if (err) return res.status(500).json({ message: "Error creating lesson" });

    res.json({ message: "Lesson created successfully" });
  });
}
// ===============================
// CREATE QUIZ
// ===============================
export const createQuiz = (req, res) => {
  const { lesson_id, title, passing_score } = req.body;

  if (!lesson_id) {
    return res.status(400).json({ message: "Missing lesson ID" });
  }

  const query = `
    INSERT INTO quizzes (lesson_id, title, passing_score)
    VALUES (?, ?, ?)
  `;

  db.query(query, [lesson_id, title, passing_score], (err) => {
    if (err) return res.status(500).json({ message: "Error creating quiz" });

    res.json({ message: "Quiz created successfully" });
  });
}
// ===============================
// CREATE QUESTION
// ===============================
export const createQuestion = (req, res) => {
  const {
    quiz_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option,
  } = req.body;

  if (!quiz_id || !question_text) {
    return res.status(400).json({ message: "Missing data" });
  }

  const query = `
    INSERT INTO quiz_questions 
    (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option],
    (err) => {
      if (err) return res.status(500).json({ message: "Error creating question" });

      res.json({ message: "Question added successfully" });
    }
  );
}
// ===============================
// GET ALL COURSES (ADMIN)
// ===============================
export const getAllCoursesAdmin = (req, res) => {
  const query = "SELECT * FROM courses";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.json(results);
  });
};