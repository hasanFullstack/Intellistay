import express from "express";
import {
  addRoom,
  getRoomsByHostel,
  getRoomById,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";
import { protect, allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.get("/hostel/:hostelId", getRoomsByHostel);
router.get("/:roomId", getRoomById);

// Protected routes (Owner only)
router.post("/hostel/:hostelId", protect, allowRoles("owner"), addRoom);
router.put("/:roomId", protect, allowRoles("owner"), updateRoom);
router.delete("/:roomId", protect, allowRoles("owner"), deleteRoom);

export default router;
