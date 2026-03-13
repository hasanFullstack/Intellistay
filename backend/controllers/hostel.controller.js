import Hostel from "../models/Hostel.js";
import HostelEnvironment from "../models/HostelEnvironment.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/role.middleware.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

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
    const filter = req.query.filter;

    // If no filter or explicit all, return all hostels (unchanged behavior)
    if (!filter || filter === "All Hostels") {
      const hostels = await Hostel.find();
      return res.json(hostels);
    }

    // Filters beyond "All Hostels" are only allowed for authenticated students
    await new Promise((resolve) => protect(req, res, resolve));
    if (!req.user) return; // protect already sent response
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ msg: "Filters available to students only" });
    }

    // Normalize filter strings
    const f = String(filter).toLowerCase();

    // AVAILABLE NOW: hostels with at least one room that has availableBeds > 0
    if (f === "available" || f === "availablenow" || f === "available now") {
      const hostelIds = await Room.find({ availableBeds: { $gt: 0 } }).distinct(
        "hostelId",
      );
      const hostels = await Hostel.find({ _id: { $in: hostelIds } });
      return res.json(hostels);
    }

    // MOST POPULAR: sort by bookingCount desc, fallback to viewCount
    if (f === "most popular" || f === "popular") {
      const agg = await Booking.aggregate([
        { $group: { _id: "$hostelId", bookingCount: { $sum: 1 } } },
        { $sort: { bookingCount: -1 } },
      ]);

      const orderedIds = agg.map((a) => String(a._id));

      const orderedHostels = await Hostel.find({
        _id: { $in: orderedIds },
      }).lean();
      const map = new Map(orderedHostels.map((h) => [String(h._id), h]));

      // Attach bookingCount as popularityScore
      const sortedByBookings = agg
        .map((a) => {
          const h = map.get(String(a._id));
          if (!h) return null;
          return { ...h, popularityScore: a.bookingCount };
        })
        .filter(Boolean);

      // Remaining hostels: return with popularityScore = 0, sorted by viewCount
      const remaining = await Hostel.find({ _id: { $nin: orderedIds } })
        .sort({ viewCount: -1 })
        .lean();
      const remainingWithScore = remaining.map((h) => ({
        ...h,
        popularityScore: 0,
      }));

      return res.json([...sortedByBookings, ...remainingWithScore]);
    }

    // RECOMMENDED: use cosine similarity between student vector and hostel vector
    if (
      f === "recommended" ||
      f === "recommend" ||
      f === "recommended hostels"
    ) {
      const userVector = Array.isArray(req.user.personalityVector)
        ? req.user.personalityVector
        : [];

      // Get all hostels so we can include those without an environment profile
      const allHostels = await Hostel.find().lean();

      const envs = await HostelEnvironment.find({
        profileCompleted: true,
      }).populate("hostelId");

      const envMap = new Map();
      envs.forEach((env) => {
        if (env.hostelId)
          envMap.set(String(env.hostelId._id || env.hostelId), env);
      });

      const results = allHostels.map((hostel) => {
        const env = envMap.get(String(hostel._id));
        const hostelVector =
          env && Array.isArray(env.hostelVector) ? env.hostelVector : [];
        const similarity =
          userVector.length && hostelVector.length
            ? cosineSimilarity(userVector, hostelVector)
            : 0;
        return { ...hostel, similarityScore: similarity };
      });

      results.sort(
        (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0),
      );

      return res.json(results);
    }

    // BUDGET OPTIMIZED: combine cosine similarity (student vector) with price
    if (f === "budget optimized" || f === "budget") {
      const userVector = req.user.personalityVector || [];

      const envs = await HostelEnvironment.find({
        profileCompleted: true,
      }).populate("hostelId");

      // Compute min price per hostel and match score
      const results = [];
      let maxPrice = 0;

      for (const env of envs) {
        const hostel = env.hostelId;

        // find rooms for hostel to determine price (use min pricePerBed as representative)
        const rooms = await Room.find({ hostelId: hostel._id });
        const prices = rooms
          .map((r) => r.pricePerBed || 0)
          .filter((p) => p > 0);
        const hostelPrice = prices.length ? Math.min(...prices) : 0;
        if (hostelPrice > maxPrice) maxPrice = hostelPrice;

        const matchScore = cosineSimilarity(
          userVector || [],
          env.hostelVector || [],
        );

        results.push({ hostel, matchScore, hostelPrice });
      }

      // Compute final score and sort
      results.forEach((r) => {
        const budgetScore =
          maxPrice > 0 ? (maxPrice - r.hostelPrice) / maxPrice : 0;
        r.finalScore = 0.7 * (r.matchScore || 0) + 0.3 * budgetScore;
      });

      results.sort((a, b) => b.finalScore - a.finalScore);

      const sortedHostels = results.map((r) => r.hostel);
      return res.json(sortedHostels);
    }

    // Unknown filter - fallback to returning all
    const hostels = await Hostel.find();
    return res.json(hostels);
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
    res.status(500).json({
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
        hostelId: req.params.id,
      });
      envDeletedCount = deleteResult.deletedCount || 0;
      console.log(
        `Deleted ${envDeletedCount} HostelEnvironment document(s) for hostel ${req.params.id}`,
      );
    } catch (envErr) {
      console.error("Failed to delete associated HostelEnvironment:", envErr);
    }

    res.json({
      msg: "Hostel deleted successfully",
      environmentDeleted: envDeletedCount > 0,
      environmentCount: envDeletedCount,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
