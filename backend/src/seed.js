import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import client, { initDb } from "./db/index.js";

const seed = async () => {
  console.log("Seeding database...");
  await initDb();

  // Clean database
  console.log("Cleaning database...");
  await client.execute("DELETE FROM answers");
  await client.execute("DELETE FROM attempts");
  await client.execute("DELETE FROM questions");
  await client.execute("DELETE FROM quizzes");
  await client.execute("DELETE FROM users");

  const adminId = uuidv4();
  const studentId = uuidv4();
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedStudentPassword = await bcrypt.hash("student123", 10);

  // Seed Users
  await client.execute({
    sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    args: [adminId, "Admin User", "admin@test.com", hashedAdminPassword, "ADMIN"],
  });

  await client.execute({
    sql: "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    args: [studentId, "Student User", "student@test.com", hashedStudentPassword, "STUDENT"],
  });

  // Seed Quiz (Exam)
  const quizId = uuidv4();
  await client.execute({
    sql: "INSERT INTO quizzes (id, title, description, duration, attempt_limit, creator_id) VALUES (?, ?, ?, ?, ?, ?)",
    args: [quizId, "General Knowledge Exam", "Test your basic knowledge.", 10, 3, adminId],
  });

  // Seed Questions
  const questions = [
    {
      id: uuidv4(),
      type: "MCQ",
      content: "Which of the following is a key feature of JavaScript's 'Closure'?",
      options: JSON.stringify([
        "A function having access to its lexical scope even when it is executed outside that scope",
        "A method to close a browser window automatically",
        "A way to encrypt variables in the global scope",
        "A feature that prevents variables from being accessed by any function"
      ]),
      correct_answer: "A function having access to its lexical scope even when it is executed outside that scope",
    },
    {
      id: uuidv4(),
      type: "MCQ",
      content: "What is the time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
      options: JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n log n)"]),
      correct_answer: "O(log n)",
    },
    {
      id: uuidv4(),
      type: "SHORT_ANSWER",
      content: "What is the name of the process in React that compares the virtual DOM with the real DOM to update only the changed parts?",
      correct_answer: "Reconciliation",
    },
    {
      id: uuidv4(),
      type: "CODING",
      content: "Write a function 'fibonacci(n)' that returns the n-th number in the Fibonacci sequence (0, 1, 1, 2, 3, 5, ...). Assume n=0 returns 0 and n=1 returns 1.",
      test_cases: JSON.stringify([
        { input: "5", output: "5" },
        { input: "10", output: "55" }
      ]),
    }
  ];

  for (const q of questions) {
    await client.execute({
      sql: "INSERT INTO questions (id, quiz_id, type, content, options, correct_answer, test_cases) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [q.id, quizId, q.type, q.content, q.options || null, q.correct_answer || null, q.test_cases || null],
    });
  }

  console.log("Seeding completed successfully");
  process.exit(0);
};

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
