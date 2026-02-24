import Hostel from "../models/Hostel.js";
import HostelEnvironment from "../models/HostelEnvironment.js";

export const addHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create({
      ...req.body,
      ownerId: req.user.id,
    });
    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate(
      "ownerId",
      "name email",
    );
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOwnerHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user.id });
    res.json(hostels);
  } catch (error) {
    console.error("Error in getOwnerHostels:", error);
    res
      .status(500)
      .json({
        msg: error.message,
        debug: { userId: req.user?.id, user: req.user },
      });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }

    if (String(hostel.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updatedHostel);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }

    if (String(hostel.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // Delete hostel
    await Hostel.findByIdAndDelete(req.params.id);

    // Also remove any associated hostel environment profile
    let envDeletedCount = 0;
    try {
      // Use deleteMany to remove all matching environments (handles string/ObjectId variations)
      const deleteResult = await HostelEnvironment.deleteMany({ 
        hostelId: req.params.id 
      });
      envDeletedCount = deleteResult.deletedCount || 0;
      console.log(`Deleted ${envDeletedCount} HostelEnvironment document(s) for hostel ${req.params.id}`);
    } catch (envErr) {
      console.error("Failed to delete associated HostelEnvironment:", envErr);
    }

    res.json({ 
      msg: "Hostel deleted successfully", 
      environmentDeleted: envDeletedCount > 0,
      environmentCount: envDeletedCount
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
