import express from "express";
import { startAttempt, submitAttempt, getLeaderboard, getUserResults } from "../controllers/attempt.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/start", authenticate, startAttempt);
router.post("/submit", authenticate, submitAttempt);
router.get("/leaderboard/:quiz_id", authenticate, getLeaderboard);
router.get("/my-results", authenticate, getUserResults);

export default router;
