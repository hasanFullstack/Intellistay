// ⚠️ IMPORTANT: Add Authentication Middleware to Routes

// Add this to your routes before controller logic to protect endpoints

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
try {
const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Sets req.user.id for controllers
    next();

} catch (error) {
res.status(401).json({ msg: "Invalid token" });
}
};

// USAGE IN ROUTES:

import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addRoom, getRoomsByHostel } from "../controllers/room.controller.js";

const router = express.Router();

// Protected routes - add authMiddleware
router.post("/hostel/:hostelId", authMiddleware, addRoom);
router.get("/hostel/:hostelId", getRoomsByHostel); // Public - no auth needed
router.put("/:roomId", authMiddleware, updateRoom);
router.delete("/:roomId", authMiddleware, deleteRoom);

export default router;

// RECOMMENDATION:
// Add authMiddleware to:
// - POST /api/hostels (addHostel)
// - POST /api/rooms/hostel/:id (addRoom)
// - PUT /api/hostels/:id (updateHostel)
// - DELETE /api/hostels/:id (deleteHostel)
// - POST /api/bookings (createBooking)
// - GET /api/bookings/my (getUserBookings)
// - PUT /api/bookings/:id/cancel (cancelBooking)

// GET endpoints (viewing hostels, rooms) can remain public
