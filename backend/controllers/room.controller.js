import Room from "../models/Room.js";
import Hostel from "../models/Hostel.js";

export const addRoom = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { roomType, totalBeds, pricePerBed, gender, images, description } =
      req.body;

    // Verify hostel exists and belongs to user
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }
    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const room = await Room.create({
      hostelId,
      roomType,
      totalBeds,
      availableBeds: totalBeds,
      pricePerBed,
      gender: gender || "Co-ed",
      images: images || [],
      description: description || "",
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoomsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const rooms = await Room.find({ hostelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate("hostelId");
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const hostel = await Hostel.findById(room.hostelId);
    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, {
      new: true,
    });

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    const hostel = await Hostel.findById(room.hostelId);
    if (hostel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Room.findByIdAndDelete(roomId);
    res.json({ msg: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
