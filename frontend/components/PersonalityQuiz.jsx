import { useState } from "react";
import { submitPersonalityQuiz } from "../src/api/personality.api";
import "./PersonalityQuiz.css";

const PersonalityQuiz = ({ userId, onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    socialPreference: "",
    cleanlinessLevel: "",
    noiseTolerance: "",
    studyHabits: "",
    budgetPreference: "",
    roommatePreference: "",
    lifestyle: "",
    facilitiesImportance: "",
    locationPreference: "",
    petFriendliness: "",
  });

  const totalSteps = 10;

  const questions = [
    {
      id: "socialPreference",
      title: "How social are you?",
      options: [
        { value: "very_social", label: "Very Social - Love meeting people" },
        {
          value: "somewhat_social",
          label: "Somewhat Social - Enjoy social activities",
        },
        {
          value: "introverted",
          label: "Introverted - Prefer smaller groups",
        },
        {
          value: "very_introverted",
          label: "Very Introverted - Prefer solitude",
        },
      ],
    },
    {
      id: "cleanlinessLevel",
      title: "What's your cleanliness preference?",
      options: [
        { value: "very_clean", label: "Very Clean - Spotless environment" },
        {
          value: "moderately_clean",
          label: "Moderately Clean - Regular cleaning",
        },
        { value: "average", label: "Average - Basic cleanliness" },
        {
          value: "not_concerned",
          label: "Not Concerned - Flexibility on cleanliness",
        },
      ],
    },
    {
      id: "noiseTolerance",
      title: "How do you feel about noise?",
      options: [
        {
          value: "very_quiet",
          label: "Very Quiet - Need silent environment",
        },
        {
          value: "somewhat_quiet",
          label: "Somewhat Quiet - Prefer calm atmosphere",
        },
        {
          value: "moderate",
          label: "Moderate - Can tolerate normal noise",
        },
        {
          value: "can_handle_loud",
          label: "Can Handle Loud - Not bothered by noise",
        },
      ],
    },
    {
      id: "studyHabits",
      title: "Where do you prefer to study?",
      options: [
        {
          value: "study_in_room",
          label: "In Room - Focus requires privacy",
        },
        {
          value: "library_preference",
          label: "Library - Prefer common study spaces",
        },
        {
          value: "flexible",
          label: "Flexible - Can study anywhere",
        },
        {
          value: "not_regular",
          label: "Not Regular - Study habits vary",
        },
      ],
    },
    {
      id: "budgetPreference",
      title: "What's your budget preference?",
      options: [
        {
          value: "luxury",
          label: "Luxury - Premium amenities important",
        },
        {
          value: "comfortable",
          label: "Comfortable - Good quality matters",
        },
        {
          value: "moderate",
          label: "Moderate - Reasonable pricing",
        },
        {
          value: "budget_conscious",
          label: "Budget Conscious - Price is primary concern",
        },
      ],
    },
    {
      id: "roommatePreference",
      title: "Roommate preference?",
      options: [
        { value: "single_room", label: "Single Room - Want privacy" },
        {
          value: "two_sharing",
          label: "Two Sharing - Comfortable with 1 roommate",
        },
        {
          value: "multi_sharing",
          label: "Multi Sharing - Like shared living",
        },
        { value: "no_preference", label: "No Preference - Either works" },
      ],
    },
    {
      id: "lifestyle",
      title: "How would you describe your lifestyle?",
      options: [
        {
          value: "health_conscious",
          label: "Health Conscious - Fitness & wellness matter",
        },
        {
          value: "balanced",
          label: "Balanced - Mix of study and relaxation",
        },
        {
          value: "social_active",
          label: "Social Active - Frequent events & parties",
        },
        {
          value: "work_focused",
          label: "Work Focused - Studies are priority",
        },
      ],
    },
    {
      id: "facilitiesImportance",
      title: "Which facilities are most important?",
      options: [
        {
          value: "gym_sports",
          label: "Gym & Sports - Fitness facilities needed",
        },
        {
          value: "gaming_entertainment",
          label: "Gaming & Entertainment - Recreation space",
        },
        {
          value: "study_space",
          label: "Study Space - Quiet study areas",
        },
        {
          value: "basic_comfort",
          label: "Basic Comfort - Just the essentials",
        },
      ],
    },
    {
      id: "locationPreference",
      title: "Location preference?",
      options: [
        { value: "city_center", label: "City Center - Urban lifestyle" },
        { value: "near_campus", label: "Near Campus - Close to college" },
        { value: "quiet_area", label: "Quiet Area - Away from hustle" },
        { value: "no_preference", label: "No Preference - Any location" },
      ],
    },
    {
      id: "petFriendliness",
      title: "Pet-friendly environment?",
      options: [
        { value: "love_pets", label: "Love Pets - Want pet-friendly hostel" },
        {
          value: "ok_with_pets",
          label: "OK With Pets - No problem if allowed",
        },
        {
          value: "no_preference",
          label: "No Preference - Pets don't matter",
        },
        { value: "no_pets", label: "No Pets - Prefer pet-free hostel" },
      ],
    },
  ];

  const currentQuestion = questions[step - 1];

  const handleOptionSelect = (value) => {
    setFormData({
      ...formData,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (!formData[currentQuestion.id]) {
      alert("Please select an option before proceeding");
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unanswered = questions.filter((q) => !formData[q.id]);
    if (unanswered.length > 0) {
      alert("Please answer all questions before submitting");
      return;
    }

    setLoading(true);
    try {
      const response = await submitPersonalityQuiz(userId, formData);
      console.log("Quiz submitted successfully:", response.data);
      alert(
        "Personality quiz submitted! We'll use this to find the perfect hostel for you.",
      );
      // Pass updated user with quizCompleted flag
      const updatedUser = { ...response.data.user, quizCompleted: true };
      onComplete(updatedUser);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Error submitting quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personality-quiz-overlay">
      <div className="personality-quiz-modal">
        <div className="quiz-header">
          <h2>📋 Student Personality Quiz</h2>
          <button className="quiz-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Question {step} of {totalSteps}
          </p>
        </div>

        <div className="quiz-content">
          <div className="quiz-question">
            <h3>{currentQuestion.title}</h3>

            <div className="quiz-options">
              {currentQuestion.options.map((option) => (
                <label key={option.value} className="quiz-option">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={formData[currentQuestion.id] === option.value}
                    onChange={() => handleOptionSelect(option.value)}
                  />
                  <span className="option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="quiz-footer">
          <button
            className="btn btn--secondary"
            onClick={handlePrev}
            disabled={step === 1}
          >
            ← Previous
          </button>

          <div className="quiz-buttons">
            {step < totalSteps && (
              <button className="btn btn--primary" onClick={handleNext}>
                Next →
              </button>
            )}
            {step === totalSteps && (
              <button
                className="btn btn--success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Quiz"}
              </button>
            )}
          </div>
        </div>

        <div className="quiz-info">
          <p>
            💡 This quiz helps us understand your preferences and recommend the
            best hostels for you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
