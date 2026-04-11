import Room from "../models/Room.js";
import Hostel from "../models/Hostel.js";
import Booking from "../models/Booking.js";
import User from "../models/Users.js";
import { getSuggestedPrice } from "../services/pricing.service.js";
import {
  calculateCompatibilityScore,
  getMatchLabel,
  getStrongMatches,
} from "../utils/matchingEngine.js";

export const addRoom = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { roomType, totalBeds, pricePerBed, images, description } =
      req.body;

    // Verify hostel exists and belongs to user
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }
    if (String(hostel.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const room = await Room.create({
      hostelId,
      roomType,
      totalBeds,
      availableBeds: totalBeds,
      pricePerBed,
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
    const rooms = await Room.find({ hostelId }).select({ images: { $slice: 1 }, roomType: 1, totalBeds: 1, availableBeds: 1, pricePerBed: 1, description: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0;
    // Use $slice to return only first image per room — keeps payload small but allows thumbnails
    let query = Room.find(
      {},
      { images: { $slice: 1 }, roomType: 1, totalBeds: 1, availableBeds: 1, pricePerBed: 1, description: 1, hostelId: 1 }
    )
      .sort({ createdAt: -1 })
      .populate('hostelId', 'name city');
    if (limit > 0) query = query.limit(limit);
    const rooms = await query.lean();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate("hostelId").lean();
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
    if (String(hostel.ownerId) !== String(req.user.id)) {
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
    if (String(hostel.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Room.findByIdAndDelete(roomId);
    res.json({ msg: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoomSuggestedPrice = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    const hostel = await Hostel.findById(room.hostelId);

    // Ensure only the owner can request the price
    if (String(hostel.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const result = await getSuggestedPrice(room, hostel);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "AI service unavailable: " + err.message });
  }
};

// Get current occupants (confirmed bookings) for a room and compatibility
export const getRoomOccupants = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    const today = new Date();

    // Find confirmed bookings that haven't ended yet
    const bookings = await Booking.find({
      roomId,
      status: "confirmed",
      endDate: { $gte: today },
    }).populate("userId", "name personalityVector personalityScore");

    if (!bookings || bookings.length === 0) {
      return res.json({
        count: 0,
        occupants: [],
        summary: {
          totalOccupiedBeds: 0,
          visibleOccupiedBeds: 0,
          profiledOccupiedBeds: 0,
          unprofiledOccupiedBeds: 0,
        },
      });
    }

    // Current viewer (must be authenticated via protect middleware)
    const currentUser = await User.findById(req.user.id).select(
      "personalityVector personalityScore name",
    );

    const totalOccupiedBeds = bookings.reduce(
      (sum, b) => sum + Math.max(Number(b.bedsBooked || 0), 0),
      0,
    );

    const visibleBookings = bookings.filter(
      (b) => String(b.userId?._id) !== String(req.user.id),
    );

    const visibleOccupiedBeds = visibleBookings.reduce(
      (sum, b) => sum + Math.max(Number(b.bedsBooked || 0), 0),
      0,
    );

    // Merge bookings by student so one student appears once with aggregated beds
    const byStudent = new Map();
    for (const b of visibleBookings) {
      const u = b.userId;
      if (!u?._id) continue;
      const key = String(u._id);
      if (!byStudent.has(key)) {
        byStudent.set(key, {
          _id: u._id,
          name: u.name,
          personalityScore: u.personalityScore,
          personalityVector: u.personalityVector || [],
          bedsBooked: 0,
          bedNumbers: [],
        });
      }
      const normalizedBedsBooked = Math.max(Number(b.bedsBooked || 0), 0);
      byStudent.get(key).bedsBooked += normalizedBedsBooked;

      const incomingBedNumbers = Array.isArray(b.bedNumbers)
        ? b.bedNumbers.filter((n) => Number.isInteger(n))
        : [];
      if (incomingBedNumbers.length > 0) {
        byStudent.get(key).bedNumbers.push(...incomingBedNumbers);
      }
    }

    const currentVector = currentUser?.personalityVector || [];
    const occupants = [];
    let profiledOccupiedBeds = 0;

    for (const s of byStudent.values()) {
      const occupant = {
        _id: s._id,
        name: s.name,
        personalityScore: s.personalityScore,
        bedsBooked: s.bedsBooked,
        bedNumbers: Array.from(new Set(s.bedNumbers)).sort((a, b) => a - b),
      };

      if (currentVector.length > 0 && s.personalityVector?.length > 0) {
        const { score, breakdown } = calculateCompatibilityScore(
          currentVector,
          s.personalityVector,
        );
        occupant.similarityScore = score;
        occupant.matchLabel = getMatchLabel(score);
        occupant.sharedTraits = getStrongMatches(breakdown);
        occupant.topMatches = [...breakdown]
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((d) => ({ label: d.label, score: d.score }));
        profiledOccupiedBeds += s.bedsBooked;
      }

      occupants.push(occupant);
    }

    const unprofiledOccupiedBeds = Math.max(
      visibleOccupiedBeds - profiledOccupiedBeds,
      0,
    );

    res.json({
      count: occupants.length,
      occupants,
      summary: {
        totalOccupiedBeds,
        visibleOccupiedBeds,
        profiledOccupiedBeds,
        unprofiledOccupiedBeds,
      },
    });
  } catch (error) {
    console.error("Error getting room occupants:", error);
    res.status(500).json({ msg: error.message });
  }
};
