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

    // COURSE
    const [courseRows] = await db.query(
      `
      SELECT 
        courses.*,
        categories.category_name
      FROM courses
      LEFT JOIN categories
      ON courses.category_id = categories.category_id
      WHERE courses.course_id = ?
      `,
      [courseId]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const course = courseRows[0];

    // CHAPTERS
    const [chapters] = await db.query(
      `
      SELECT *
      FROM chapters
      WHERE course_id = ?
      ORDER BY chapter_order ASC
      `,
      [courseId]
    );

    // LESSONS
    const [lessons] = await db.query(
      `
      SELECT *
      FROM lessons
      WHERE course_id = ?
      ORDER BY chapter_id ASC, lesson_order ASC
      `,
      [courseId]
    );

    // QUIZZES
    const [quizzes] = await db.query(
      `
      SELECT *
      FROM quizzes
      WHERE chapter_id IN (
        SELECT chapter_id
        FROM chapters
        WHERE course_id = ?
      )
      `,
      [courseId]
    );

    // COMBINE DATA
    const chaptersWithContent = chapters.map((chapter) => {
      const chapterLessons = lessons.filter(
        (lesson) =>
          Number(lesson.chapter_id) === Number(chapter.chapter_id)
      );

      const chapterQuiz = quizzes.find(
        (quiz) =>
          Number(quiz.chapter_id) === Number(chapter.chapter_id)
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

    res.status(500).json({
      message: "Server error",
    });
  }
};