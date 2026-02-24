import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Get current user profile (protected route)
router.get("/profile", protect, (req, res) => {
  // req.user is already populated by protect middleware
  res.json({ user: req.user });
});

export default router;
