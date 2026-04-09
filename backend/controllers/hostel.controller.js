import Hostel from "../models/Hostel.js";
import HostelEnvironment from "../models/HostelEnvironment.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/role.middleware.js";
import { calculateCompatibilityScore } from "../utils/matchingEngine.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const HOSTEL_LIST_FIELDS =
  "name location description amenities images rules environmentScore viewCount createdAt";
const HOSTEL_DETAIL_FIELDS =
  "ownerId name location description amenities images rules environmentScore viewCount createdAt updatedAt";
const HOSTEL_CACHE_TTL_MS = 60 * 1000;
const hostelCache = new Map();

const getCachedHostelData = (key) => {
  const cached = hostelCache.get(key);

  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    hostelCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedHostelData = (key, data) => {
  hostelCache.set(key, {
    data,
    expiresAt: Date.now() + HOSTEL_CACHE_TTL_MS,
  });
};

const clearHostelCache = () => {
  hostelCache.clear();
};

export const addHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create({
      ...req.body,
      ownerId: req.user.id,
    });
    clearHostelCache();
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
      const cachedHostels = getCachedHostelData("hostels:all");
      if (cachedHostels) {
        return res.json(cachedHostels);
      }

      const hostels = await Hostel.find()
        .select(HOSTEL_LIST_FIELDS)
        .sort({ createdAt: -1 })
        .lean();
      setCachedHostelData("hostels:all", hostels);
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
      const cachedHostels = getCachedHostelData("hostels:available");
      if (cachedHostels) {
        return res.json(cachedHostels);
      }

      const hostelIds = await Room.distinct("hostelId", {
        availableBeds: { $gt: 0 },
      });
      const hostels = await Hostel.find({ _id: { $in: hostelIds } })
        .select(HOSTEL_LIST_FIELDS)
        .lean();
      setCachedHostelData("hostels:available", hostels);
      return res.json(hostels);
    }

    // MOST POPULAR: sort by bookingCount desc, fallback to viewCount
    if (f === "most popular" || f === "popular") {
      const cachedHostels = getCachedHostelData("hostels:popular");
      if (cachedHostels) {
        return res.json(cachedHostels);
      }

      const agg = await Booking.aggregate([
        { $group: { _id: "$hostelId", bookingCount: { $sum: 1 } } },
        { $sort: { bookingCount: -1 } },
      ]);

      const orderedIds = agg.map((a) => String(a._id));

      const orderedHostels = await Hostel.find({
        _id: { $in: orderedIds },
      })
        .select(HOSTEL_LIST_FIELDS)
        .lean();
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
        .select(HOSTEL_LIST_FIELDS)
        .sort({ viewCount: -1 })
        .lean();
      const remainingWithScore = remaining.map((h) => ({
        ...h,
        popularityScore: 0,
      }));

      const popularHostels = [...sortedByBookings, ...remainingWithScore];
      setCachedHostelData("hostels:popular", popularHostels);
      return res.json(popularHostels);
    }

    // RECOMMENDED: use weighted matching engine between student vector and hostel vector
    if (
      f === "recommended" ||
      f === "recommend" ||
      f === "recommended hostels"
    ) {
      const userVector = Array.isArray(req.user.personalityVector)
        ? req.user.personalityVector
        : [];

      const envs = await HostelEnvironment.find({
        profileCompleted: true,
      }).populate("hostelId", HOSTEL_LIST_FIELDS);

      const results = envs
        .filter((env) => env.hostelId)
        .map((env) => {
          const hostelVector =
            env && Array.isArray(env.hostelVector) ? env.hostelVector : [];
          const { score } = calculateCompatibilityScore(userVector, hostelVector);
          const hostel = env.hostelId.toObject ? env.hostelId.toObject() : env.hostelId;
          return { ...hostel, similarityScore: score };
        })
        .filter((h) => h.similarityScore > 0)
        .sort(
          (a, b) => (b.similarityScore || 0) - (a.similarityScore || 0),
        );

      return res.json(results);
    }

    // BUDGET OPTIMIZED: combine cosine similarity (student vector) with price
    if (f === "budget optimized" || f === "budget") {
      const userVector = req.user.personalityVector || [];

      const envs = await HostelEnvironment.find({
        profileCompleted: true,
      }).populate("hostelId", HOSTEL_LIST_FIELDS);

      const hostelIds = envs
        .map((env) => env.hostelId?._id)
        .filter(Boolean);
      const priceStats = await Room.aggregate([
        { $match: { hostelId: { $in: hostelIds } } },
        {
          $group: {
            _id: "$hostelId",
            hostelPrice: { $min: "$pricePerBed" },
          },
        },
      ]);
      const priceMap = new Map(
        priceStats.map((item) => [String(item._id), item.hostelPrice || 0]),
      );

      // Compute min price per hostel and match score
      const results = [];
      let maxPrice = 0;

      for (const env of envs) {
        const hostel = env.hostelId;
        if (!hostel) continue;

        const hostelPrice = priceMap.get(String(hostel._id)) || 0;
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
    const hostels = await Hostel.find().select(HOSTEL_LIST_FIELDS).lean();
    return res.json(hostels);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const cacheKey = `hostel:${req.params.id}`;
    const cachedHostel = getCachedHostelData(cacheKey);
    if (cachedHostel) {
      return res.json(cachedHostel);
    }

    const hostel = await Hostel.findById(req.params.id).populate(
      "ownerId",
      "name email",
    ).select(HOSTEL_DETAIL_FIELDS).lean();
    if (!hostel) {
      return res.status(404).json({ msg: "Hostel not found" });
    }
    setCachedHostelData(cacheKey, hostel);
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getOwnerHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ ownerId: req.user.id })
      .select(HOSTEL_DETAIL_FIELDS)
      .sort({ createdAt: -1 })
      .lean();
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
    clearHostelCache();
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
    clearHostelCache();

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
