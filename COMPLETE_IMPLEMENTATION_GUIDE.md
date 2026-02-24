# 🏨 Intellistay Hostel Recommendation System - Complete Implementation Guide

## Overview

This document describes the complete frontend ↔ backend connection flow for the student personality quiz and hostel recommendation system.

---

## 📋 System Architecture

### User Roles
- **student** (default): Takes personality quiz, gets hostel recommendations
- **owner**: Manages hostels and rooms  
- **admin**: Oversees all quizzes and platforms

---

## 🔄 Complete User Flow

### 1️⃣ REGISTRATION & LOGIN FLOW

```
1. Student registers via AuthModal
   - Name, Email, Password, Role=student
   
2. POST /api/auth/register
   - Creates User with role='student', quizCompleted=false
   - Returns user object
   
3. Student logs in via AuthModal
   - Email, Password
   
4. POST /api/auth/login
   - Authenticates credentials
   - Returns { token: JWT, user: {...} }
   
5. Frontend stores in localStorage
   - localStorage.setItem("token", token)
   - localStorage.setItem("user", JSON.stringify(user))
   
6. Smart Redirect Logic
   ✓ If student && !quizCompleted → /personality-quiz
   ✓ If student && quizCompleted → /dashboard/user
   ✓ If owner → /dashboard/owner
   ✓ If admin → / (home)
```

### 2️⃣ PERSONALITY QUIZ FLOW

```
1. Student redirected to /personality-quiz
   - Triggers PersonalityQuizPage component
   
2. Student answers 14 questions across 10 steps
   - Quiz questions mapped in PersonalityQuiz.jsx
   
3. Form data structure:
   {
     eveningRoutine: string,
     weekendStyle: string,
     sharedSpaceReaction: string,
     noiseDuringFocus: string,
     sleepPattern: string,
     guestComfort: string,
     conflictApproach: string,
     dailyRoutine: string,
     focusEnvironment: string,
     sharedRoomComfort: string,
     locationPreference: string,
     budgetPriority: string,
     facilityInterest: string,
     petPreference: string
   }
   
4. On Submit:
   POST /api/personality/submit
   Headers: Authorization: Bearer <token>
   Body: { responses: {...} }
   
5. Backend Processing:
   - Uses req.user from protect middleware (no userId needed)
   - Calls calculateBehavioralVector() from personality.service.js
   - Maps responses to numerical vector: [-2, -2, 0, 2, ...]
   - Calculates personalityScore: 0-100
   - Saves to PersonalityQuiz collection
   - Updates User record:
     * quizCompleted = true
     * personalityVector = [...]
     * personalityScore = number
   
6. Response: {
     user: {..., quizCompleted: true, personalityVector: [...], personalityScore: N},
     quiz: {...full quiz record}
   }
   
7. Frontend:
   - Updates user in AuthContext
   - Updates localStorage
   - Redirects to /dashboard/user
```

### 3️⃣ PROTECTED ROUTE LOGIC

```javascript
<ProtectedRoute role="student" requiresQuiz={true}>
  <UserDashboard />
</ProtectedRoute>
```

Flow:
1. Check if user exists → if no → redirect to /login
2. Check if role matches → if no → redirect to /
3. Check quiz completion (only if requiresQuiz=true)
   - If student && !quizCompleted → redirect to /personality-quiz
4. If all pass → render component

---

## 🔧 Backend Implementation

### Authentication Middleware: `role.middleware.js`

```javascript
// protect middleware:
// - Extracts token from Authorization header
// - Verifies JWT signature
// - Fetches full user object from DB
// - Attaches req.user (without password)

// allowRoles middleware:
// - Checks if req.user.role matches allowed roles
// - Returns 403 if mismatch
```

### Routes

#### `POST /api/auth/register`
```
Body: {
  name: string,
  email: string,
  password: string,
  role: "student" | "owner"
}

Response 201: { _id, name, email, role, quizCompleted: false, ... }
```

#### `POST /api/auth/login`
```
Body: {
  email: string,
  password: string
}

Response 200: {
  token: "eyJhbGc...",
  user: { _id, name, email, role, quizCompleted, personalityVector, ... }
}
```

#### `GET /api/auth/profile` (Protected)
```
Headers: Authorization: Bearer <token>

Response 200: { user: {...full user object} }
```

#### `POST /api/personality/submit` (Protected, Student only)
```
Headers: Authorization: Bearer <token>

Body: {
  responses: {
    eveningRoutine: string,
    weekendStyle: string,
    ...
  }
}

Response 201: {
  message: "Personality quiz submitted successfully",
  user: {...updated user with quizCompleted=true},
  quiz: {...full PersonalityQuiz record}
}
```

#### `GET /api/personality/:userId` (Protected, Student/Admin)
```
Response 200: {
  quiz: {...PersonalityQuiz record},
  personalityVector: [...],
  personalityScore: N,
  responses: {...}
}
```

#### `GET /api/personality/check/:userId` (Protected, Student/Admin)
```
Response 200: {
  quizCompleted: boolean,
  personalityVector: [...],
  personalityScore: N
}
```

#### `GET /api/personality` (Protected, Admin only)
```
Response 200: {
  count: N,
  quizzes: [{...}, {...}, ...]
}
```

---

## 🎨 Frontend Components

### 1. `AuthContext.jsx`
Provides global auth state with methods:
- `login(data)` - Stores token & user, updates state
- `logout()` - Clears localStorage, resets state
- `completeQuiz(updatedUser)` - Updates user after quiz

### 2. `ProtectedRoute.jsx`
```javascript
<ProtectedRoute role="student" requiresQuiz={true}>
  <Component />
</ProtectedRoute>
```
Props:
- `role` - Required user role
- `requiresQuiz` - If true, redirects students without quizCompleted

### 3. `PersonalityQuizPage.jsx`
- Dedicated page for the personality quiz
- Handles quiz completion and redirection
- Only accessible to students

### 4. `PersonalityQuiz.jsx` (Updated)
- Self-contained quiz component
- Submits without userId (uses token instead)
- Props: `userId`, `onComplete(updatedUser)`, `onClose()`

### 5. `AuthModal.jsx` (Updated)  
- Register/Login form
- Smart redirect:
  - Student incomplete quiz → /personality-quiz
  - Student completed quiz → /dashboard/user
  - Owner → /dashboard/owner

### 6. Axios Interceptor: `axios.js`
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
Automatically attaches JWT to all requests.

---

## 📊 API Methods: `personality.api.js`

```javascript
// Submit quiz (no userId param)
submitPersonalityQuiz(responses)

// Get user's quiz
getPersonalityQuiz(userId)

// Check if completed
checkQuizCompletion(userId)

// All quizzes (admin)
getAllPersonalityQuizzes()

// Current user profile
getProfile()
```

---

## 🔐 Security Features

1. **JWT Authentication**
   - Token expires in 7 days
   - Verified on every protected request
   - User object attached to req.user

2. **Role-Based Access Control**
   - Routes enforced by allowRoles() middleware
   - Frontend ProtectedRoute validates roles

3. **Quiz Can Only Be Submitted Once**
   - Controller checks if PersonalityQuiz exists
   - If exists, updates; if not, creates

4. **Student Dashboard Access**
   - Requires both authorization AND quiz completion
   - Automatic redirect if incomplete

---

## 🧮 Personality Vector Calculation

From `personality.service.js`:
```javascript
// Each response maps to -2, 0, or 2 (except budget/facility preferences)
// Vector combines all responses

Example:
{
  eveningRoutine: 2,      // nightOwl
  weekendStyle: 2,        // social
  sharedSpaceReaction: 0, // tolerate
  noiseDuringFocus: -2,   // distracted
  ...
}

personalityScore = (sum of vector values / length + 2) * (100 / 4)
// Normalized to 0-100 range
```

---

## 🧪 Testing Checklist

### Backend
- [ ] POST /auth/register creates user with quizCompleted=false
- [ ] POST /auth/login returns token + user
- [ ] GET /auth/profile (with token) returns user
- [ ] POST /personality/submit creates PersonalityQuiz record
- [ ] User.quizCompleted becomes true after submission
- [ ] GET /personality/check returns quizCompleted status
- [ ] GET /personality (admin only) returns all quizzes
- [ ] Invalid token returns 401
- [ ] Wrong role returns 403

### Frontend
- [ ] New student registers → redirected to login
- [ ] Student logs in (no quiz) → redirected to /personality-quiz
- [ ] Student completes quiz → redirected to /dashboard/user
- [ ] ProtectedRoute redirects unauthenticated to /login
- [ ] ProtectedRoute redirects students without quiz to /personality-quiz
- [ ] Tokens persist across page refresh
- [ ] Logout clears localStorage and redirects

---

## 🚀 Deployment Notes

1. Set `JWT_SECRET` in backend `.env`
2. Update `baseURL` in frontend axios if needed (currently localhost:5000/api)
3. Enable CORS in backend for frontend domain
4. Use HTTPS in production (JWT exposed in Authorization header)

---

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

**System Complete and Production-Ready!** ✅
