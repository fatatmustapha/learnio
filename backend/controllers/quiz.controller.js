import db from "../config/db.js";
import bcrypt from "bcrypt";

// ===============================
// GET QUIZ BY LESSON
// ===============================
export const getQuizByLesson = (req, res) => {
  const { lessonId } = req.params;

  const quizQuery = "SELECT * FROM quizzes WHERE lesson_id = ?";

  db.query(quizQuery, [lessonId], (err, quizResults) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (quizResults.length === 0) {
      return res.status(404).json({ message: "No quiz found" });
    }

    const quiz = quizResults[0];

    const questionQuery = "SELECT * FROM quiz_questions WHERE quiz_id = ?";

    db.query(questionQuery, [quiz.quiz_id], (err, questionResults) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        ...quiz,
        questions: questionResults,
      });
    });
  });
};


// ===============================
// SUBMIT QUIZ
// ===============================
export const submitQuiz = (req, res) => {
  const { kid_id, quiz_id, answers } = req.body;

  // answers = [{ question_id, selected_option }]

  const questionQuery = "SELECT * FROM quiz_questions WHERE quiz_id = ?";

  db.query(questionQuery, [quiz_id], (err, questions) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    let score = 0;

    questions.forEach((q) => {//loop through the questions where q is each question at the time 
      const userAnswer = answers.find(a => a.question_id === q.question_id);
        //grabs the users submitted answer for the question we are checking  
      if (userAnswer && userAnswer.selected_option === q.correct_option) {
        score++;
      }
    });

    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 60;

    const insertQuery = `
      INSERT INTO quiz_attempts (kid_id, quiz_id, score, passed)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [kid_id, quiz_id, percentage, passed], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving attempt" });
      }

      res.json({
        message: "Quiz submitted",
        score: percentage,
        passed,
      });
    });
  });
};