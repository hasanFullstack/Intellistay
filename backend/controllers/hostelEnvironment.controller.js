import HostelEnvironment from "../models/HostelEnvironment.js";
import Hostel from "../models/Hostel.js";

// Submit or update hostel environment profile (for owners)
export const submitHostelEnvironment = async (req, res) => {
  try {
    const { hostelId, ownerId, environmentProfile } = req.body;

    if (!hostelId || !ownerId || !environmentProfile) {
      return res.status(400).json({
        message: "Hostel ID, Owner ID, and environment profile are required",
      });
    }

    // Verify hostel exists and belongs to owner
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (hostel.owner.toString() !== ownerId) {
      return res.status(403).json({
        message: "You are not authorized to update this hostel's environment",
      });
    }

    // Calculate environment score
    const environmentScore = calculateEnvironmentScore(environmentProfile);

    // Find existing environment profile or create new one
    let profile = await HostelEnvironment.findOne({ hostelId });

    if (profile) {
      // Update existing profile
      profile.environmentProfile = environmentProfile;
      profile.environmentScore = environmentScore;
      profile.profileCompleted = true;
    } else {
      // Create new profile
      profile = new HostelEnvironment({
        hostelId,
        ownerId,
        environmentProfile,
        environmentScore,
        profileCompleted: true,
      });
    }

    await profile.save();

    res.status(201).json({
      message: "Hostel environment profile submitted successfully",
      profile,
      environmentScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get hostel environment profile
export const getHostelEnvironment = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const environment = await HostelEnvironment.findOne({
      hostelId,
    }).populate("hostelId", "name");

    if (!environment) {
      return res.status(404).json({
        message: "Hostel environment profile not found",
      });
    }

    res.status(200).json(environment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if hostel environment profile is completed
export const checkEnvironmentCompletion = async (req, res) => {
  try {
    const { hostelId } = req.params;

    const environment = await HostelEnvironment.findOne({ hostelId });

    res.status(200).json({
      completed: environment ? environment.profileCompleted : false,
      environmentScore: environment ? environment.environmentScore : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate environment score
const calculateEnvironmentScore = (profile) => {
  let score = 50; // Base score

  // Social environment (+/-10)
  if (profile.socialEnvironment === "very_social") score += 10;
  else if (profile.socialEnvironment === "very_quiet") score -= 10;
  else if (profile.socialEnvironment === "somewhat_social") score += 5;
  else if (profile.socialEnvironment === "quiet") score -= 5;

  // Cleanliness standard (+/-8)
  if (profile.cleanlinessStandard === "very_strict") score += 8;
  else if (profile.cleanlinessStandard === "relaxed") score -= 8;
  else if (profile.cleanlinessStandard === "strict") score += 4;
  else if (profile.cleanlinessStandard === "moderate") score -= 2;

  // Noise level (+/-6)
  if (profile.noiseLevelNight === "very_quiet") score += 6;
  else if (profile.noiseLevelNight === "party_zone") score -= 6;
  else if (profile.noiseLevelNight === "quiet") score += 3;

  // Amenities (+/- based on count)
  if (profile.amenities && profile.amenities.length > 5) score += 5;
  else if (profile.amenities && profile.amenities.length > 3) score += 3;

  // Academic focus (+/-4)
  if (profile.academicFocus === "very_high") score += 4;
  else if (profile.academicFocus === "low") score -= 4;

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// Get all hostel environment profiles (admin/analytics)
export const getAllHostelEnvironments = async (req, res) => {
  try {
    const environments = await HostelEnvironment.find()
      .populate("hostelId", "name")
      .populate("ownerId", "name email");

    res.status(200).json(environments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get similar hostels based on student personality and hostel environment
export const getRecommendedHostels = async (req, res) => {
  try {
    const { studentPersonalityScore } = req.body;

    if (studentPersonalityScore === undefined) {
      return res
        .status(400)
        .json({ message: "Student personality score is required" });
    }

    // Get all hostel environments
    const environments = await HostelEnvironment.find({
      profileCompleted: true,
    }).populate("hostelId");

    // Calculate compatibility score for each hostel
    const recommendedHostels = environments
      .map((env) => {
        const compatibility = Math.abs(
          env.environmentScore - studentPersonalityScore,
        );
        return {
          hostel: env.hostelId,
          environment: env.environmentProfile,
          compatibilityScore: 100 - compatibility, // Higher score = better match
          environmentScore: env.environmentScore,
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10); // Top 10 recommendations

    res.status(200).json(recommendedHostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
