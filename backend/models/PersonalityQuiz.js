import mongoose from "mongoose";

const personalityQuizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    email: String,
    responses: {
      // Question 1: Social preference
      socialPreference: {
        type: String,
        enum: [
          "very_social",
          "somewhat_social",
          "introverted",
          "very_introverted",
        ],
      },
      // Question 2: Cleanliness level
      cleanlinessLevel: {
        type: String,
        enum: ["very_clean", "moderately_clean", "average", "not_concerned"],
      },
      // Question 3: Noise tolerance
      noiseTolerance: {
        type: String,
        enum: ["very_quiet", "somewhat_quiet", "moderate", "can_handle_loud"],
      },
      // Question 4: Study habits
      studyHabits: {
        type: String,
        enum: [
          "study_in_room",
          "library_preference",
          "flexible",
          "not_regular",
        ],
      },
      // Question 5: Budget preference
      budgetPreference: {
        type: String,
        enum: ["luxury", "comfortable", "moderate", "budget_conscious"],
      },
      // Question 6: Roommate preference
      roommatePreference: {
        type: String,
        enum: ["single_room", "two_sharing", "multi_sharing", "no_preference"],
      },
      // Question 7: Lifestyle
      lifestyle: {
        type: String,
        enum: ["health_conscious", "balanced", "social_active", "work_focused"],
      },
      // Question 8: Facilities importance
      facilitiesImportance: {
        type: String,
        enum: [
          "gym_sports",
          "gaming_entertainment",
          "study_space",
          "basic_comfort",
        ],
      },
      // Question 9: Location preference
      locationPreference: {
        type: String,
        enum: ["city_center", "near_campus", "quiet_area", "no_preference"],
      },
      // Question 10: Pet friendliness
      petFriendliness: {
        type: String,
        enum: ["love_pets", "ok_with_pets", "no_preference", "no_pets"],
      },
    },
    personalityScore: {
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

export default mongoose.model("PersonalityQuiz", personalityQuizSchema);
