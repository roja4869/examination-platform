import { v4 as uuidv4 } from "uuid";
import client from "../db/index.js";

export const createQuiz = async (req, res) => {
  const { title, description, duration, attempt_limit } = req.body;
  const creator_id = req.user.id;
  const id = uuidv4();

  try {
    await client.execute({
      sql: "INSERT INTO quizzes (id, title, description, duration, attempt_limit, creator_id) VALUES (?, ?, ?, ?, ?, ?)",
      args: [id, title, description, duration, attempt_limit || 1, creator_id],
    });

    res.status(201).json({ message: "Quiz created successfully", id });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const result = await client.execute("SELECT * FROM quizzes ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const quizResult = await client.execute({
      sql: "SELECT * FROM quizzes WHERE id = ?",
      args: [id],
    });

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questionsResult = await client.execute({
      sql: "SELECT id, type, content, options FROM questions WHERE quiz_id = ?",
      args: [id],
    });

    // Parse options if MCQ
    const questions = questionsResult.rows.map(q => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null
    }));

    res.json({ ...quizResult.rows[0], questions });
  } catch (error) {
    console.error("Get quiz by id error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addQuestion = async (req, res) => {
  const { quiz_id } = req.params;
  const { type, content, options, correct_answer, test_cases } = req.body;
  const id = uuidv4();

  try {
    await client.execute({
      sql: "INSERT INTO questions (id, quiz_id, type, content, options, correct_answer, test_cases) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        id,
        quiz_id,
        type,
        content,
        options ? JSON.stringify(options) : null,
        correct_answer,
        test_cases ? JSON.stringify(test_cases) : null
      ],
    });

    res.status(201).json({ message: "Question added successfully", id });
  } catch (error) {
    console.error("Add question error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    await client.execute({
      sql: "DELETE FROM quizzes WHERE id = ?",
      args: [id],
    });
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, attempt_limit } = req.body;

  try {
    await client.execute({
      sql: "UPDATE quizzes SET title = ?, description = ?, duration = ?, attempt_limit = ? WHERE id = ?",
      args: [title, description, duration, attempt_limit, id],
    });
    res.json({ message: "Quiz updated successfully" });
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
