import api from "./axios";

// Submit personality quiz
export const submitPersonalityQuiz = async (userId, responses) => {
  return api.post("/personality/submit", { userId, responses });
};

// Get personality quiz for a user
export const getPersonalityQuiz = async (userId) => {
  return api.get(`/personality/${userId}`);
};

// Check if user has completed personality quiz
export const checkQuizCompletion = async (userId) => {
  return api.get(`/personality/check/${userId}`);
};

// Get all personality quizzes (admin only)
export const getAllPersonalityQuizzes = async () => {
  return api.get("/personality");
};
