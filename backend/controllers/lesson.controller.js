import db from "../config/db.js";

const COURSE_TOTAL_XP = 50;
const LESSON_XP_PERCENT = 0.7;
const QUIZ_XP_PERCENT = 0.3;

const recalculateKidCourse = async (kidId, courseId) => {
  const lessonXPTotal = COURSE_TOTAL_XP * LESSON_XP_PERCENT;
  const quizXPTotal = COURSE_TOTAL_XP * QUIZ_XP_PERCENT;

  const [totalLessonRows] = await db.query(
    `SELECT COUNT(*) AS totalLessons FROM lessons WHERE course_id = ?`,
    [courseId]
  );

  const totalLessons = Number(totalLessonRows[0].totalLessons || 0);
  const xpPerLesson = totalLessons > 0 ? lessonXPTotal / totalLessons : 0;

  const [completedLessonRows] = await db.query(
    `
    SELECT COUNT(*) AS completedLessons
    FROM lesson_completions lc
    JOIN lessons l ON lc.lesson_id = l.lesson_id
    WHERE lc.kid_id = ?
    AND l.course_id = ?
    `,
    [kidId, courseId]
  );

  const completedLessons = Number(completedLessonRows[0].completedLessons || 0);
  const lessonXP = completedLessons * xpPerLesson;
  const lessonProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 70 : 0;

  const [totalChapterRows] = await db.query(
    `SELECT COUNT(*) AS totalChapters FROM chapters WHERE course_id = ?`,
    [courseId]
  );

  const totalChapters = Number(totalChapterRows[0].totalChapters || 0);
  const xpPerQuiz = totalChapters > 0 ? quizXPTotal / totalChapters : 0;

  const [bestQuizRows] = await db.query(
    `
    SELECT 
      q.quiz_id,
      MAX(qa.earned_xp) AS bestXp,
      MAX(qa.passed) AS passed
    FROM quizzes q
    JOIN chapters ch ON q.chapter_id = ch.chapter_id
    LEFT JOIN quiz_attempts qa 
      ON qa.quiz_id = q.quiz_id 
      AND qa.kid_id = ?
    WHERE ch.course_id = ?
    GROUP BY q.quiz_id
    `,
    [kidId, courseId]
  );

  const quizXP = bestQuizRows.reduce(
    (sum, row) => sum + Number(row.bestXp || 0),
    0
  );

  const passedQuizzes = bestQuizRows.filter(
    (row) => Number(row.passed) === 1
  ).length;

  const quizProgress = totalChapters > 0 ? (passedQuizzes / totalChapters) * 30 : 0;

  const courseXP = Number((lessonXP + quizXP).toFixed(2));
  const progressPercent = Math.min(Math.round(lessonProgress + quizProgress), 100);
  const completed = progressPercent >= 100;

  await db.query(
    `
    INSERT INTO progress
    (kid_id, course_id, completed_lessons, progress_percent, completed)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      completed_lessons = VALUES(completed_lessons),
      progress_percent = VALUES(progress_percent),
      completed = VALUES(completed)
    `,
    [kidId, courseId, completedLessons, progressPercent, completed ? 1 : 0]
  );

  if (completed) {
    const [badgeRows] = await db.query(
      `SELECT badge_id FROM badges WHERE course_id = ? LIMIT 1`,
      [courseId]
    );

    if (badgeRows.length > 0) {
      await db.query(
        `
        INSERT IGNORE INTO kid_badges (kid_id, badge_id)
        VALUES (?, ?)
        `,
        [kidId, badgeRows[0].badge_id]
      );
    }
  }

  const [allCourseXpRows] = await db.query(
    `
    SELECT course_id
    FROM courses
    `
  );

  let totalKidXP = 0;

  for (const course of allCourseXpRows) {
    const [courseProgressRows] = await db.query(
      `
      SELECT completed_lessons
      FROM progress
      WHERE kid_id = ? AND course_id = ?
      `,
      [kidId, course.course_id]
    );

    const [courseLessonRows] = await db.query(
      `SELECT COUNT(*) AS totalLessons FROM lessons WHERE course_id = ?`,
      [course.course_id]
    );

    const totalCourseLessons = Number(courseLessonRows[0].totalLessons || 0);
    const completedCourseLessons = Number(
      courseProgressRows[0]?.completed_lessons || 0
    );

    const lessonXpForCourse =
      totalCourseLessons > 0
        ? completedCourseLessons * (lessonXPTotal / totalCourseLessons)
        : 0;

    const [courseChapterRows] = await db.query(
      `SELECT COUNT(*) AS totalChapters FROM chapters WHERE course_id = ?`,
      [course.course_id]
    );

    const totalCourseChapters = Number(courseChapterRows[0].totalChapters || 0);
    const quizXpPerCourseQuiz =
      totalCourseChapters > 0 ? quizXPTotal / totalCourseChapters : 0;

    const [courseBestQuizRows] = await db.query(
      `
      SELECT MAX(qa.earned_xp) AS bestXp
      FROM quizzes q
      JOIN chapters ch ON q.chapter_id = ch.chapter_id
      LEFT JOIN quiz_attempts qa 
        ON qa.quiz_id = q.quiz_id 
        AND qa.kid_id = ?
      WHERE ch.course_id = ?
      GROUP BY q.quiz_id
      `,
      [kidId, course.course_id]
    );

    const quizXpForCourse = courseBestQuizRows.reduce(
      (sum, row) => sum + Number(row.bestXp || 0),
      0
    );

    totalKidXP += lessonXpForCourse + quizXpForCourse;
  }

  const finalXP = Number(totalKidXP.toFixed(2));
  const level = Math.floor(finalXP / 50) + 1;

  await db.query(
    `
    UPDATE kids
    SET xp_points = ?, level = ?
    WHERE kid_id = ?
    `,
    [finalXP, level, kidId]
  );

  return {
    courseXP,
    totalKidXP: finalXP,
    level,
    progressPercent,
    completed,
    completedLessons,
    totalLessons,
    xpPerLesson,
  };
};

export const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        l.lesson_id,
        l.title,
        l.content,
        l.video_url,
        l.lesson_order,
        l.chapter_id,
        l.course_id,
        c.title AS course_title,
        ch.title AS chapter_title,
        ch.chapter_order
      FROM lessons l
      JOIN courses c ON l.course_id = c.course_id
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      WHERE l.lesson_id = ?
      `,
      [lessonId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET LESSON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const kidId = req.user.id;
    const { lessonId } = req.params;

    const [lessonRows] = await db.query(
      `
      SELECT lesson_id, course_id, chapter_id
      FROM lessons
      WHERE lesson_id = ?
      `,
      [lessonId]
    );

    if (lessonRows.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const lesson = lessonRows[0];

    await db.query(
      `
      INSERT IGNORE INTO lesson_completions (kid_id, lesson_id)
      VALUES (?, ?)
      `,
      [kidId, lessonId]
    );

    const result = await recalculateKidCourse(kidId, lesson.course_id);

    res.json({
      message: "Lesson completed successfully",
      kid_id: kidId,
      lesson_id: lesson.lesson_id,
      course_id: lesson.course_id,
      chapter_id: lesson.chapter_id,
      ...result,
    });
  } catch (error) {
    console.error("COMPLETE LESSON ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};