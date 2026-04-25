import express from "express";
import { createQuiz, getQuizzes, getQuizById, addQuestion, deleteQuiz, updateQuiz } from "../controllers/quiz.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getQuizzes);
router.get("/:id", authenticate, getQuizById);

// Admin only routes
router.post("/", authenticate, authorize("ADMIN"), createQuiz);
router.put("/:id", authenticate, authorize("ADMIN"), updateQuiz);
router.post("/:quiz_id/questions", authenticate, authorize("ADMIN"), addQuestion);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteQuiz);

export default router;
