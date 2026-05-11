import db from "../config/db.js";

// GET ALL COURSES
export const getCourses = async (req, res) => {
  try {
    const [courses] = await db.query("SELECT * FROM courses");
    res.json(courses);
  } catch (error) {
    console.error("ERROR FETCHING COURSES:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET COURSE DETAILS
export const getCourseDetails = async (req, res) => {
  try {
    const courseId = Number(req.params.id);

    const [courseRows] = await db.query(
      `
      SELECT courses.*, categories.category_name
      FROM courses
      LEFT JOIN categories ON courses.category_id = categories.category_id
      WHERE courses.course_id = ?
      `,
      [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = courseRows[0];

    const [chapters] = await db.query(
      `
      SELECT *
      FROM chapters
      WHERE course_id = ?
      ORDER BY chapter_order ASC
      `,
      [courseId]
    );

    const [lessons] = await db.query(
      `
      SELECT *
      FROM lessons
      WHERE course_id = ?
      ORDER BY chapter_id ASC, lesson_order ASC
      `,
      [courseId]
    );

    const [quizzes] = await db.query(
      `
      SELECT *
      FROM quizzes
      WHERE chapter_id IN (
        SELECT chapter_id FROM chapters WHERE course_id = ?
      )
      `,
      [courseId]
    );

    const chaptersWithContent = chapters.map((chapter) => {
      const chapterLessons = lessons.filter(
        (lesson) => Number(lesson.chapter_id) === Number(chapter.chapter_id)
      );

      const chapterQuiz = quizzes.find(
        (quiz) => Number(quiz.chapter_id) === Number(chapter.chapter_id)
      );

      return {
        ...chapter,
        lessons: chapterLessons,
        quiz: chapterQuiz || null,
      };
    });

    res.json({
      course,
      chapters: chaptersWithContent,
    });
  } catch (error) {
    console.error("ERROR FETCHING COURSE DETAILS:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ENROLL COURSE
export const enrollCourse = async (req, res) => {
  try {
    const { kid_id, course_id } = req.body;

    if (!kid_id || !course_id) {
      return res.status(400).json({
        message: "kid_id and course_id are required",
      });
    }

    const [existing] = await db.query(
      `
      SELECT progress_id
      FROM progress
      WHERE kid_id = ? AND course_id = ?
      `,
      [kid_id, course_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "This course is already enrolled for this child.",
      });
    }

    await db.query(
      `
      INSERT INTO progress
      (kid_id, course_id, completed_lessons, progress_percent, completed)
      VALUES (?, ?, 0, 0, 0)
      `,
      [kid_id, course_id]
    );

    res.json({
      success: true,
      message: "Course enrolled successfully",
    });
  } catch (error) {
    console.error("ENROLL COURSE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};