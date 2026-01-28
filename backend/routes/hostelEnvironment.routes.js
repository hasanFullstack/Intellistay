import express from "express";
import {
  submitHostelEnvironment,
  getHostelEnvironment,
  checkEnvironmentCompletion,
  getAllHostelEnvironments,
  getRecommendedHostels,
} from "../controllers/hostelEnvironment.controller.js";

const router = express.Router();

// Submit or update hostel environment profile
router.post("/submit", submitHostelEnvironment);

// Get hostel environment profile
router.get("/:hostelId", getHostelEnvironment);

// Check if hostel environment profile is completed
router.get("/check/:hostelId", checkEnvironmentCompletion);

// Get recommended hostels for a student
router.post("/recommend", getRecommendedHostels);

// Get all hostel environment profiles (admin)
router.get("/", getAllHostelEnvironments);

export default router;
