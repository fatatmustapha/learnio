import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [parents] = await db.query("SELECT COUNT(*) AS total FROM parents");
    const [kids] = await db.query("SELECT COUNT(*) AS total FROM kids");
    const [courses] = await db.query("SELECT COUNT(*) AS total FROM courses");
    const [enrollments] = await db.query("SELECT COUNT(*) AS total FROM progress");

    res.json({
      totalParents: parents[0].total,
      totalKids: kids[0].total,
      totalCourses: courses[0].total,
      totalEnrollments: enrollments[0].total,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCoursesAdmin = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.*, COUNT(DISTINCT p.kid_id) AS enrolled_count
      FROM courses c
      LEFT JOIN progress p ON c.course_id = p.course_id
      GROUP BY c.course_id
      ORDER BY c.course_id DESC
    `);

    res.json(courses);
  } catch (error) {
    console.error("GET ADMIN COURSES ERROR:", error);
    res.status(500).json({ message: "Database error" });
  }
};

export const deleteLessonAdmin = async (req, res) => {
  try {
    const { lessonId } = req.params;

    await db.query("DELETE FROM lesson_completions WHERE lesson_id = ?", [lessonId]);
    await db.query("DELETE FROM lessons WHERE lesson_id = ?", [lessonId]);

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    res.status(500).json({ message: "Error deleting lesson" });
  }
};

export const deleteQuizAdmin = async (req, res) => {
  try {
    const { quizId } = req.params;

    await db.query("DELETE FROM quiz_attempts WHERE quiz_id = ?", [quizId]);
    await db.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quizId]);
    await db.query("DELETE FROM quizzes WHERE quiz_id = ?", [quizId]);

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("DELETE QUIZ ERROR:", error);
    res.status(500).json({ message: "Error deleting quiz" });
  }
};

export const deleteChapterAdmin = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { chapterId } = req.params;

    await connection.beginTransaction();

    const [quizzes] = await connection.query(
      "SELECT quiz_id FROM quizzes WHERE chapter_id = ?",
      [chapterId]
    );

    const [lessons] = await connection.query(
      "SELECT lesson_id FROM lessons WHERE chapter_id = ?",
      [chapterId]
    );

    for (const quiz of quizzes) {
      await connection.query("DELETE FROM quiz_attempts WHERE quiz_id = ?", [quiz.quiz_id]);
      await connection.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quiz.quiz_id]);
    }

    for (const lesson of lessons) {
      await connection.query("DELETE FROM lesson_completions WHERE lesson_id = ?", [lesson.lesson_id]);
    }

    await connection.query("DELETE FROM quizzes WHERE chapter_id = ?", [chapterId]);
    await connection.query("DELETE FROM lessons WHERE chapter_id = ?", [chapterId]);
    await connection.query("DELETE FROM chapters WHERE chapter_id = ?", [chapterId]);

    await connection.commit();

    res.json({ message: "Chapter deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("DELETE CHAPTER ERROR:", error);
    res.status(500).json({ message: "Error deleting chapter" });
  } finally {
    connection.release();
  }
};

export const deleteCourseAdmin = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { courseId } = req.params;

    await connection.beginTransaction();

    const [quizzes] = await connection.query(
      `
      SELECT q.quiz_id
      FROM quizzes q
      JOIN chapters ch ON q.chapter_id = ch.chapter_id
      WHERE ch.course_id = ?
      `,
      [courseId]
    );

    const [lessons] = await connection.query(
      "SELECT lesson_id FROM lessons WHERE course_id = ?",
      [courseId]
    );

    for (const quiz of quizzes) {
      await connection.query("DELETE FROM quiz_attempts WHERE quiz_id = ?", [quiz.quiz_id]);
      await connection.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quiz.quiz_id]);
    }

    for (const lesson of lessons) {
      await connection.query("DELETE FROM lesson_completions WHERE lesson_id = ?", [lesson.lesson_id]);
    }

    await connection.query(
      `
      DELETE q FROM quizzes q
      JOIN chapters ch ON q.chapter_id = ch.chapter_id
      WHERE ch.course_id = ?
      `,
      [courseId]
    );

    await connection.query("DELETE FROM lessons WHERE course_id = ?", [courseId]);
    await connection.query("DELETE FROM chapters WHERE course_id = ?", [courseId]);
    await connection.query("DELETE FROM progress WHERE course_id = ?", [courseId]);
    await connection.query("DELETE FROM badges WHERE course_id = ?", [courseId]);
    await connection.query("DELETE FROM courses WHERE course_id = ?", [courseId]);

    await connection.commit();

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ message: "Error deleting course" });
  } finally {
    connection.release();
  }
};

export const updateChapterAdmin = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { title } = req.body;

    await db.query("UPDATE chapters SET title = ? WHERE chapter_id = ?", [
      title,
      chapterId,
    ]);

    res.json({ message: "Chapter updated successfully" });
  } catch (error) {
    console.error("UPDATE CHAPTER ERROR:", error);
    res.status(500).json({ message: "Error updating chapter" });
  }
};

export const updateLessonAdmin = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, video_url } = req.body;

    await db.query(
      "UPDATE lessons SET title = ?, video_url = ? WHERE lesson_id = ?",
      [title, video_url, lessonId]
    );

    res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    res.status(500).json({ message: "Error updating lesson" });
  }
};

export const updateQuizAdmin = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title } = req.body;

    await db.query("UPDATE quizzes SET title = ? WHERE quiz_id = ?", [
      title,
      quizId,
    ]);

    res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    console.error("UPDATE QUIZ ERROR:", error);
    res.status(500).json({ message: "Error updating quiz" });
  }
};