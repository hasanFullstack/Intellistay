import express from "express";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { protect, allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Protected routes (Students)
router.post("/", protect, allowRoles("student"), createBooking);
router.get("/my", protect, allowRoles("student"), getUserBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, allowRoles("student"), cancelBooking);

export default router;
