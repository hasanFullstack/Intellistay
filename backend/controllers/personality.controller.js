import PersonalityQuiz from "../models/PersonalityQuiz.js";
import User from "../models/Users.js";

// Submit or update personality quiz
export const submitPersonalityQuiz = async (req, res) => {
  try {
    const { userId, responses } = req.body;

    if (!userId || !responses) {
      return res
        .status(400)
        .json({ message: "User ID and responses are required" });
    }

    // Verify user exists and is a student
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can complete personality quiz" });
    }

    // Calculate personality score based on responses
    const personalityScore = calculatePersonalityScore(responses);

    // Find existing quiz or create new one
    let quiz = await PersonalityQuiz.findOne({ userId });

    if (quiz) {
      // Update existing quiz
      quiz.responses = responses;
      quiz.personalityScore = personalityScore;
      quiz.profileCompleted = true;
    } else {
      // Create new quiz
      quiz = new PersonalityQuiz({
        userId,
        email: user.email,
        responses,
        personalityScore,
        profileCompleted: true,
      });
    }

    await quiz.save();

    // Update user's personality score and mark quiz as completed
    user.personalityScore = personalityScore;
    user.quizCompleted = true;
    await user.save();

    res.status(201).json({
      message: "Personality quiz submitted successfully",
      quiz,
      personalityScore,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get personality quiz for a user
export const getPersonalityQuiz = async (req, res) => {
  try {
    const { userId } = req.params;

    const quiz = await PersonalityQuiz.findOne({ userId });

    if (!quiz) {
      return res.status(404).json({ message: "Personality quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user has completed personality quiz
export const checkQuizCompletion = async (req, res) => {
  try {
    const { userId } = req.params;

    const quiz = await PersonalityQuiz.findOne({ userId });

    res.status(200).json({
      completed: quiz ? quiz.profileCompleted : false,
      personalityScore: quiz ? quiz.personalityScore : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate personality score (algorithm can be improved with ML later)
const calculatePersonalityScore = (responses) => {
  let score = 50; // Base score

  // Social preference (+/-10)
  if (responses.socialPreference === "very_social") score += 10;
  else if (responses.socialPreference === "very_introverted") score -= 10;
  else if (responses.socialPreference === "somewhat_social") score += 5;
  else if (responses.socialPreference === "introverted") score -= 5;

  // Cleanliness level (+/-8)
  if (responses.cleanlinessLevel === "very_clean") score += 8;
  else if (responses.cleanlinessLevel === "not_concerned") score -= 8;
  else if (responses.cleanlinessLevel === "moderately_clean") score += 4;
  else if (responses.cleanlinessLevel === "average") score -= 4;

  // Noise tolerance (+/-6)
  if (responses.noiseTolerance === "can_handle_loud") score += 6;
  else if (responses.noiseTolerance === "very_quiet") score -= 6;
  else if (responses.noiseTolerance === "moderate") score += 3;

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// Get all quizzes (for admin/analytics)
export const getAllPersonalityQuizzes = async (req, res) => {
  try {
    const quizzes = await PersonalityQuiz.find().populate(
      "userId",
      "name email",
    );
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
