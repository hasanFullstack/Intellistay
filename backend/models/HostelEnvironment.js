import mongoose from "mongoose";

const hostelEnvironmentSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      unique: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    environmentProfile: {
      // Social environment level
      socialEnvironment: {
        type: String,
        enum: ["very_social", "somewhat_social", "quiet", "very_quiet"],
        default: "somewhat_social",
      },
      // Cleanliness standard
      cleanlinessStandard: {
        type: String,
        enum: ["very_strict", "strict", "moderate", "relaxed"],
        default: "moderate",
      },
      // Noise level during different times
      noiseLevelDay: {
        type: String,
        enum: ["quiet", "moderate", "lively", "very_lively"],
        default: "moderate",
      },
      noiseLevelNight: {
        type: String,
        enum: ["very_quiet", "quiet", "moderate", "party_zone"],
        default: "quiet",
      },
      // Study environment
      studyEnvironment: {
        type: Boolean,
        default: true,
      },
      // Amenities available
      amenities: [String], // e.g., ["gym", "gaming_room", "library", "cafe", "sports_ground"]
      // Party/Event frequency
      eventFrequency: {
        type: String,
        enum: ["frequent", "occasional", "rare", "none"],
        default: "occasional",
      },
      // Pet policy
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      // Visitor policy
      visitorPolicy: {
        type: String,
        enum: ["open", "restricted_hours", "restricted_days", "no_visitors"],
        default: "restricted_hours",
      },
      // Average age group of residents
      ageGroup: {
        type: String,
        enum: ["18-20", "20-22", "22-24", "mixed"],
        default: "mixed",
      },
      // Geographic diversity
      diverseBackground: {
        type: Boolean,
        default: true,
      },
      // Academic focus level
      academicFocus: {
        type: String,
        enum: ["very_high", "high", "moderate", "low"],
        default: "moderate",
      },
      // Maintenance quality
      maintenanceQuality: {
        type: String,
        enum: ["excellent", "good", "average", "poor"],
        default: "good",
      },
      // Budget tier
      budgetTier: {
        type: String,
        enum: ["luxury", "premium", "mid_range", "budget"],
        default: "mid_range",
      },
      // Nature/Environment nearby
      nearbyNature: {
        type: Boolean,
        default: false,
      },
    },
    environmentScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("HostelEnvironment", hostelEnvironmentSchema);
