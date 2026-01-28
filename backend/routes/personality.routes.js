import express from "express";
import {
  submitPersonalityQuiz,
  getPersonalityQuiz,
  checkQuizCompletion,
  getAllPersonalityQuizzes,
} from "../controllers/personality.controller.js";

const router = express.Router();

// Submit or update personality quiz
router.post("/submit", submitPersonalityQuiz);

// Get personality quiz for a user
router.get("/:userId", getPersonalityQuiz);

// Check if user has completed personality quiz
router.get("/check/:userId", checkQuizCompletion);

// Get all personality quizzes (admin)
router.get("/", getAllPersonalityQuizzes);

export default router;
