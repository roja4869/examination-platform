import { v4 as uuidv4 } from "uuid";
import client from "../db/index.js";

export const startAttempt = async (req, res) => {
  const { quiz_id } = req.body;
  const user_id = req.user.id;

  try {
    // Check attempt limit
    const quizResult = await client.execute({
      sql: "SELECT attempt_limit FROM quizzes WHERE id = ?",
      args: [quiz_id],
    });

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const attemptLimit = quizResult.rows[0].attempt_limit;

    const existingAttempts = await client.execute({
      sql: "SELECT COUNT(*) as count FROM attempts WHERE user_id = ? AND quiz_id = ? AND status = 'COMPLETED'",
      args: [user_id, quiz_id],
    });

    if (existingAttempts.rows[0].count >= attemptLimit) {
      return res.status(403).json({ message: "Attempt limit reached" });
    }

    const id = uuidv4();
    await client.execute({
      sql: "INSERT INTO attempts (id, user_id, quiz_id) VALUES (?, ?, ?)",
      args: [id, user_id, quiz_id],
    });

    res.status(201).json({ id });
  } catch (error) {
    console.error("Start attempt error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const submitAttempt = async (req, res) => {
  const { attempt_id, answers } = req.body; // answers: [{ question_id, user_answer }]
  const user_id = req.user.id;

  try {
    const attemptResult = await client.execute({
      sql: "SELECT quiz_id FROM attempts WHERE id = ? AND user_id = ? AND status = 'STARTED'",
      args: [attempt_id, user_id],
    });

    if (attemptResult.rows.length === 0) {
      return res.status(404).json({ message: "Attempt not found or already submitted" });
    }

    const quiz_id = attemptResult.rows[0].quiz_id;

    // Fetch correct answers
    const questionsResult = await client.execute({
      sql: "SELECT id, correct_answer, type FROM questions WHERE quiz_id = ?",
      args: [quiz_id],
    });

    const questionMap = new Map();
    questionsResult.rows.forEach(q => questionMap.set(q.id, q));

    let score = 0;
    const answerInserts = [];

    for (const ans of answers) {
      const question = questionMap.get(ans.question_id);
      if (!question) continue;

      let isCorrect = false;
      if (question.type === "MCQ" || question.type === "SHORT_ANSWER") {
        isCorrect = String(ans.user_answer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
      } else if (question.type === "CODING") {
        // Basic implementation: check if output matches. 
        // In a real app, you'd run the code against test cases.
        // For now, we'll assume the student module sends a flag or we do a simple check.
        isCorrect = true; // Placeholder for coding evaluation
      }

      if (isCorrect) score++;

      answerInserts.push({
        id: uuidv4(),
        attempt_id,
        question_id: ans.question_id,
        user_answer: String(ans.user_answer),
        is_correct: isCorrect
      });
    }

    // Insert answers
    for (const ans of answerInserts) {
      await client.execute({
        sql: "INSERT INTO answers (id, attempt_id, question_id, user_answer, is_correct) VALUES (?, ?, ?, ?, ?)",
        args: [ans.id, ans.attempt_id, ans.question_id, ans.user_answer, ans.is_correct],
      });
    }

    const finalScore = (score / questionsResult.rows.length) * 100;

    await client.execute({
      sql: "UPDATE attempts SET score = ?, completed_at = CURRENT_TIMESTAMP, status = 'COMPLETED' WHERE id = ?",
      args: [finalScore, attempt_id],
    });

    res.json({ message: "Attempt submitted", score: finalScore });
  } catch (error) {
    console.error("Submit attempt error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  const { quiz_id } = req.params;
  try {
    const result = await client.execute({
      sql: `
        SELECT u.name, a.score, a.completed_at 
        FROM attempts a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.quiz_id = ? AND a.status = 'COMPLETED'
        ORDER BY a.score DESC, a.completed_at ASC
        LIMIT 10
      `,
      args: [quiz_id],
    });
    res.json(result.rows);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserResults = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await client.execute({
      sql: `
        SELECT a.*, q.title as quiz_title 
        FROM attempts a 
        JOIN quizzes q ON a.quiz_id = q.id 
        WHERE a.user_id = ? AND a.status = 'COMPLETED'
        ORDER BY a.completed_at DESC
      `,
      args: [user_id],
    });
    res.json(result.rows);
  } catch (error) {
    console.error("Get user results error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
