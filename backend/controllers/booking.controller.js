import Hostel from "../models/Hostel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const createBooking = async (req, res) => {
  try {
    const { hostelId, roomId, startDate, endDate, bedsBooked } = req.body;

    // Verify hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }

    // Verify room exists and belongs to this hostel
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    if (room.hostelId.toString() !== hostelId) {
      return res
        .status(400)
        .json({ msg: "Room does not belong to this hostel" });
    }

    // Check availability
    if (room.availableBeds < bedsBooked) {
      return res.status(400).json({ msg: "Not enough available beds" });
    }

    // Calculate total price
    const totalPrice = room.pricePerBed * bedsBooked;

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      hostelId,
      roomId,
      startDate,
      endDate,
      bedsBooked,
      totalPrice,
      status: "confirmed",
    });

    // Update room availability
    room.availableBeds -= bedsBooked;
    await room.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("hostelId", "name location")
      .populate("roomId", "roomType pricePerBed gender");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("hostelId")
      .populate("roomId")
      .populate("userId", "name email");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ msg: "Booking already cancelled" });
    }

    // Restore availability
    const room = await Room.findById(booking.roomId);
    room.availableBeds += booking.bedsBooked;
    await room.save();

    booking.status = "cancelled";
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
