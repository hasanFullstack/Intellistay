import User from "../models/Users.js";
import HostelEnvironment from "../models/HostelEnvironment.js";
import Hostel from "../models/Hostel.js";

// Cosine Similarity Function
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dot / (magnitudeA * magnitudeB);
};

// Get student recommendations
export const getStudentRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.quizCompleted || !user.personalityVector) {
            return res.status(400).json({
                message: "Complete personality quiz first",
            });
        }

        const environments = await HostelEnvironment.find({
            profileCompleted: true,
        }).populate("hostelId");

        const recommendations = environments
            .map((env) => {
                const similarity = cosineSimilarity(
                    user.personalityVector,
                    env.hostelVector
                );

                return {
                    hostel: env.hostelId,
                    similarityScore: similarity,
                };
            })
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, 10);

        res.status(200).json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};