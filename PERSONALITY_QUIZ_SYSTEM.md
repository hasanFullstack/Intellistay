# Personality Quiz & Hostel Environment Matching System

## Overview

This system is designed to match students with suitable hostels by analyzing their personality preferences and comparing them with hostel environments. It uses a scoring algorithm that can be enhanced with ML models in the future.

## Features Implemented

### 1. Student Personality Quiz

A popup form for students that captures their preferences across 10 dimensions:

- **Social Preference**: How social the student is (Very Social to Very Introverted)
- **Cleanliness Level**: Preferred cleanliness standards
- **Noise Tolerance**: Comfort with noise levels
- **Study Habits**: Where they prefer to study
- **Budget Preference**: Price sensitivity and comfort level
- **Roommate Preference**: Single/Shared room preferences
- **Lifestyle**: General lifestyle (Health-conscious, Balanced, Social, Work-focused)
- **Facilities Importance**: Key amenities needed
- **Location Preference**: Preferred location (City center, Near campus, Quiet area)
- **Pet Friendliness**: Attitude toward pets

#### Popup Behavior

- Shows automatically when a student logs in and visits their dashboard for the first time
- Can be dismissed by clicking the X button
- Progress bar shows current question and total progress
- Previous/Next navigation between questions
- Submit button appears on the last question

### 2. Personality Score Calculation

- Base score: 50 (neutral)
- Scoring algorithm adjusts based on responses:
  - Social preference: ±10 points
  - Cleanliness level: ±8 points
  - Noise tolerance: ±6 points
  - Other factors: ±3-5 points
- Final score clamped between 0-100
- Score stored in `PersonalityQuiz` model and updated in User model

### 3. Hostel Environment Profile

A companion system for hostel owners to define their hostel's environment:

- **Social Environment**: Level of social activity (Very Social to Very Quiet)
- **Cleanliness Standard**: Hostel's cleanliness expectations
- **Noise Levels**: Different noise levels for day and night
- **Study Environment**: Whether quiet study spaces are available
- **Amenities**: List of available facilities (gym, gaming room, library, cafe, sports ground)
- **Event Frequency**: How often events/parties are organized
- **Pet Policy**: Whether pets are allowed
- **Visitor Policy**: Open, restricted hours, restricted days, or no visitors
- **Age Group**: Average age of residents
- **Diverse Background**: Whether residents are from diverse backgrounds
- **Academic Focus**: Focus level on academics
- **Maintenance Quality**: Hostel maintenance standards
- **Budget Tier**: Luxury, Premium, Mid-range, or Budget
- **Nature Nearby**: Whether nearby nature is available

#### Environment Score Calculation

Similar to personality score with weights:

- Social environment: ±10 points
- Cleanliness: ±8 points
- Noise level: ±6 points
- Amenities: +3-5 based on count
- Academic focus: ±4 points
- Final score: 0-100

## Files Created/Modified

### Backend Files

**Models:**

- `backend/models/PersonalityQuiz.js` - Student personality quiz data
- `backend/models/HostelEnvironment.js` - Hostel environment profile data

**Controllers:**

- `backend/controllers/personality.controller.js` - Quiz submission, retrieval, completion check
- `backend/controllers/hostelEnvironment.controller.js` - Environment profile management and recommendation engine

**Routes:**

- `backend/routes/personality.routes.js` - Personality quiz endpoints
- `backend/routes/hostelEnvironment.routes.js` - Hostel environment endpoints

**Updated:**

- `backend/server.js` - Added new route imports and middleware

### Frontend Files

**Components:**

- `frontend/components/PersonalityQuiz.jsx` - Interactive quiz popup component
- `frontend/components/PersonalityQuiz.css` - Styling for quiz modal

**API:**

- `frontend/src/api/personality.api.js` - API calls for personality quiz
- `frontend/src/api/hostelEnvironment.api.js` - API calls for hostel environment

**Pages:**

- `frontend/src/pages/user/UserDashboard.jsx` - Updated to show quiz popup on first dashboard visit

## API Endpoints

### Personality Quiz Endpoints

**POST** `/api/personality/submit`

```json
{
  "userId": "user_id",
  "responses": {
    "socialPreference": "very_social",
    "cleanlinessLevel": "very_clean",
    "noiseTolerance": "moderate",
    "studyHabits": "study_in_room",
    "budgetPreference": "comfortable",
    "roommatePreference": "two_sharing",
    "lifestyle": "balanced",
    "facilitiesImportance": "gym_sports",
    "locationPreference": "near_campus",
    "petFriendliness": "ok_with_pets"
  }
}
```

**GET** `/api/personality/check/:userId`

- Returns: `{ completed: boolean, personalityScore: number }`

**GET** `/api/personality/:userId`

- Returns: Complete personality quiz document

**GET** `/api/personality`

- Returns: All personality quizzes (admin)

### Hostel Environment Endpoints

**POST** `/api/hostel-environment/submit`

```json
{
  "hostelId": "hostel_id",
  "ownerId": "owner_id",
  "environmentProfile": {
    "socialEnvironment": "somewhat_social",
    "cleanlinessStandard": "strict",
    "noiseLevelDay": "lively",
    "noiseLevelNight": "quiet",
    "studyEnvironment": true,
    "amenities": ["gym", "gaming_room", "cafe"],
    "eventFrequency": "occasional",
    "petsAllowed": false,
    "visitorPolicy": "restricted_hours",
    "ageGroup": "20-22",
    "diverseBackground": true,
    "academicFocus": "high",
    "maintenanceQuality": "good",
    "budgetTier": "mid_range",
    "nearbyNature": false
  }
}
```

**GET** `/api/hostel-environment/:hostelId`

- Returns: Hostel environment profile

**GET** `/api/hostel-environment/check/:hostelId`

- Returns: `{ completed: boolean, environmentScore: number }`

**POST** `/api/hostel-environment/recommend`

```json
{
  "studentPersonalityScore": 65
}
```

- Returns: Top 10 recommended hostels with compatibility scores

**GET** `/api/hostel-environment`

- Returns: All hostel environment profiles (admin)

## Database Schema

### PersonalityQuiz Collection

```javascript
{
  userId: ObjectId,
  email: String,
  responses: {
    socialPreference: String,
    cleanlinessLevel: String,
    noiseTolerance: String,
    studyHabits: String,
    budgetPreference: String,
    roommatePreference: String,
    lifestyle: String,
    facilitiesImportance: String,
    locationPreference: String,
    petFriendliness: String
  },
  personalityScore: Number,
  profileCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### HostelEnvironment Collection

```javascript
{
  hostelId: ObjectId,
  ownerId: ObjectId,
  environmentProfile: { ... },
  environmentScore: Number,
  profileCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Future Enhancements

### ML-Based Matching

1. **Advanced Scoring Algorithm**: Use ML to learn from student satisfaction with matched hostels
2. **Compatibility ML Model**: Train on successful hostel-student pairings
3. **Collaborative Filtering**: Recommend hostels based on similar students' preferences

### Owner Features

1. **Environment Quiz Popup**: Show environment profile form to owners when creating hostel
2. **Environment Analytics**: Dashboard showing hostel compatibility distribution
3. **Student Preferences Insight**: Analytics on what students are looking for

### Student Features

1. **Smart Recommendations**: Show matched hostels in home feed/search
2. **Personalized Browsing**: Sort/filter hostels by compatibility score
3. **Preference Refinement**: Allow students to retake quiz or update preferences
4. **Hostel Reviews**: Connect personality matches with reviews for learning

### Admin Features

1. **Match Analytics**: View distribution of personality-environment matches
2. **Recommendation Performance**: Track which recommendations lead to bookings
3. **Trend Analysis**: Identify popular hostels and student preferences over time

## Testing the System

### Test Personality Quiz Flow

1. Create a student account
2. Login and navigate to User Dashboard
3. Personality quiz should appear automatically
4. Fill out all 10 questions and submit
5. Verify data in database

### Test Recommendation Engine

```bash
# After creating personality profile and environment profile:
POST /api/hostel-environment/recommend
{
  "studentPersonalityScore": 65
}
```

## Notes

- Session storage is used for authentication (clears on browser close)
- Personality quiz is required for students (shown on first dashboard visit)
- Recommendation algorithm can be significantly improved with ML in future
- Both scores use 0-100 scale for consistency
- Current matching is based on score proximity (lower difference = better match)
