# System Architecture Diagrams

## 1. Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INTELLISTAY SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

                            REGISTRATION PATH
                                   │
                                   ▼
                         ┌──────────────────┐
                         │  Student Input   │
                         │  Name, Email,    │
                         │  Password,       │
                         │  Role=student    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  POST /register  │
                         │  (Backend)       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ MongoDB: Users   │
                         │ quizCompleted:   │
                         │ false ✓          │
                         └────────┬─────────┘
                                  │
                                  ▼
              ──────────────────────────────────────────┐
              │        Student Logs In                  │
              │        POST /login                      │
              │        Returns JWT Token + User         │
              └────────┬────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────┐
         │ localStorage.setItem("token", ...)  │
         │ localStorage.setItem("user", ...)   │
         └────────┬────────────────────────────┘
                  │
           ▼──────┴──────▼
    ┌─────────────────────────────┐
    │ Check user.quizCompleted    │
    └──────┬──────────────┬───────┘
           │              │
        false          true
           │              │
           ▼              ▼
    ┌─────────────────┐  ┌──────────────────┐
    │/personality-    │  │/dashboard/user   │
    │quiz PAGE (NEW)  │  │(Student Dash)    │
    └────────┬────────┘  └──────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ PersonalityQuiz.jsx (14 questions)  │
    │ - Evening routine                   │
    │ - Weekend style                     │
    │ - Shared space reaction             │
    │ - Noise during focus                │
    │ - Sleep pattern                     │
    │ - Guest comfort                     │
    │ - Conflict approach                 │
    │ - Daily routine                     │
    │ - Focus environment                 │
    │ - Shared room comfort               │
    │ - Location preference               │
    │ - Budget priority                   │
    │ - Facility interest                 │
    │ - Pet preference                    │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ POST /personality/submit        │
    │ Headers:                        │
    │ Authorization: Bearer {token}   │
    │ Body: { responses: {...} }      │
    └────────┬────────────────────────┘
             │
             ▼ Backend Processing
    ┌─────────────────────────────────────────┐
    │1. Extract user from req.user            │
    │2. Calculate behavioral vector           │
    │3. Calculate personality score (0-100)   │
    │4. Save to PersonalityQuiz collection    │
    │5. Update User: quizCompleted=true       │
    │6. Return updated user                   │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ MongoDB Writes:                  │
    │ ├─ Users: quizCompleted=true     │
    │ │         personalityVector=[...] │
    │ │         personalityScore=XX     │
    │ └─ PersonalityQuizzes: Full quiz │
    │           record saved            │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ Frontend:                      │
    │ ├─ Update AuthContext.user     │
    │ ├─ Update localStorage         │
    │ └─ Navigate to /dashboard/user │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │ ProtectedRoute Validation:     │
    │ ✓ user exists                  │
    │ ✓ role === "student"           │
    │ ✓ quizCompleted === true       │
    │ → Render UserDashboard         │
    └────────────────────────────────┘
```

---

## 2. Request/Response Flow Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Context)                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  AuthContext ◄──────────────────────────────────────────────────┐ │
│  ├─ user state                                                  │ │
│  ├─ login()                                                     │ │
│  ├─ logout()                                                    │ │
│  └─ completeQuiz()                                              │ │
│                                                                 │ │
│  localStorage                                                  │ │
│  ├─ token                                                       │ │
│  └─ user (JSON)                                                 │ │
│                                                                 │ │
│  Axios Interceptor                                              │ │
│  └─ Attaches "Authorization: Bearer {token}" to every request  │ │
│                                                                 │ │
│  Routes (React Router)                                          │ │
│  ├─ / (Home)                                                     │ │
│  ├─ /login (AuthModal)                                           │ │
│  ├─ /personality-quiz (PersonalityQuizPage) ◄───────────────┐ │ │
│  ├─ /dashboard/user (ProtectedRoute)                           │ │ │
│  └─ /dashboard/owner (ProtectedRoute)                          │ │ │
│                                                                 │ │ │
│  Components                                                     │ │ │
│  ├─ AuthModal (Login/Register)                                 │ │ │
│  ├─ PersonalityQuizPage (NEW) ───────────────────────────────┘ │ │
│  ├─ PersonalityQuiz (Quiz form)                                │ │
│  ├─ ProtectedRoute (Authorization check)                       │ │
│  └─ UserDashboard (After quiz)                                 │ │
│                                                                 │ │
│  API Calls (via axios)                                         │ │ │
│  ├─ registerApi(data)          → POST /auth/register           │ │ │
│  ├─ loginApi(data)             → POST /auth/login             │ │ │
│  ├─ submitPersonalityQuiz(res) → POST /personality/submit    │ │ │
│  ├─ getProfile()               → GET /auth/profile             │ │ │
│  └─ checkQuizCompletion(id)    → GET /personality/check/:id   │ │ │
│        │                                                        │ │ │
│        ▼                                                        │ │ │
└────────────────┬───────────────────────────────────────────────┼─┘ │
                 │ HTTP Requests                                 │   │
                 │ (with Authorization header if token exists)   │   │
                 │                                              │   │
    ┌────────────▼──────────────────────────────────────┐       │   │
    │          BACKEND (Node.js + Express)              │       │   │
    ├───────────────────────────────────────────────────┤       │   │
    │                                                   │       │   │
    │  Routes                                           │       │   │
    │  ├─ POST /auth/register (no middleware)         │       │   │
    │  ├─ POST /auth/login (no middleware)            │       │   │
    │  ├─ GET /auth/profile (protect)                 │       │   │
    │  ├─ POST /personality/submit (protect, student) │       │   │
    │  ├─ GET /personality/:userId (protect)          │       │   │
    │  ├─ GET /personality/check/:userId (protect)    │       │   │
    │  └─ GET /personality (protect, admin)           │       │   │
    │                                                   │       │   │
    │  Middleware                                       │       │   │
    │  ├─ protect ─► Extract token ─► Verify JWT ────┼───────┘   │
    │  │            ─► Get user from DB                │           │
    │  │            ─► Attach to req.user              │           │
    │  │                                                │           │
    │  └─ allowRoles() ─► Check req.user.role          │           │
    │                                                   │           │
    │  Controllers                                      │           │
    │  ├─ auth.controller.js                          │           │
    │  │  ├─ register() → Create user                 │           │
    │  │  └─ login() → Return token + user            │           │
    │  │                                                │           │
    │  └─ personality.controller.js                    │           │
    │     ├─ submitPersonalityQuiz() ──► Uses req.user           │
    │     │                    ├─► Calculate vector              │
    │     │                    ├─► Save to PersonalityQuiz       │
    │     │                    └─► Update User                   │
    │     ├─ getPersonalityQuiz()                                 │           │
    │     ├─ checkQuizCompletion()                                │           │
    │     └─ getAllPersonalityQuizzes()                           │           │
    │                                                   │           │
    │  Services                                         │           │
    │  ├─ personality.service.js                       │           │
    │  │  └─ calculateBehavioralVector(responses)     │           │
    │  │     ► Maps responses to -2..2 values          │           │
    │  │     ► Returns vector + budgetPreference       │           │
    │  │                                                │           │
    │  └─ recommendation.service.js                    │           │
    │     └─ getSmartRecommendations(user)            │           │
    │        ► (Future: Match user to hostels)         │           │
    │                                                   │           │
    │  Models                                           │           │
    │  ├─ Users                                        │           │
    │  │  ├─ _id                                       │           │
    │  │  ├─ name, email, password                     │           │
    │  │  ├─ role                                      │           │
    │  │  ├─ quizCompleted ◄──────────────────────────┘           │
    │  │  ├─ personalityVector                                     │
    │  │  ├─ personalityScore                                      │
    │  │  └─ budgetPreference                                      │
    │  │                                                 │           │
    │  └─ PersonalityQuizzes                          │           │
    │     ├─ _id                                       │           │
    │     ├─ userId (ref: User)                        │           │
    │     ├─ responses (all 14 answers)                │           │
    │     ├─ personalityVector                         │           │
    │     ├─ personalityScore                          │           │
    │     └─ profileCompleted                          │           │
    │                                                   │           │
    └───────────────┬───────────────────────────────────┘           │
                    │ HTTP Responses                                │
                    │ (JSON with user/data)                        │
                    │                                              │
                    ▼                                              │
         ┌─────────────────────┐                                   │
         │  Database (MongoDB) │                                   │
         ├─────────────────────┤                                   │
         │ Collections:        │                                   │
         │ ├─ users           │                                   │
         │ ├─ personalityquizzes                                 │
         │ ├─ hostels         │                                   │
         │ └─ rooms           │                                   │
         └─────────────────────┘                                   │
                    ▲                                              │
                    │ MongoDB queries/writes                       │
                    │                                              │
                    └──────────────────────────────────────────────┘
```

---

## 3. Quiz Completion Flow

```
Student Logs In
│
├─── Response shows: quizCompleted = false
│
▼
AuthContext checks:
├─ role === "student"? ✓
└─ !quizCompleted? ✓
│
▼
AuthModal redirects to /personality-quiz
│
▼
PersonalityQuizPage loads:
├─ Checks role === "student" ✓
├─ Checks !quizCompleted ✓
└─ Renders PersonalityQuiz component
│
▼
PersonalityQuiz shows 10 steps × questions:
├─ Step 1: eveningRoutine
├─ Step 2: weekendStyle
├─ Step 3: sharedSpaceReaction
├─ Step 4: noiseDuringFocus
├─ Step 5: sleepPattern
├─ Step 6: guestComfort
├─ Step 7: conflictApproach
├─ Step 8: dailyRoutine
├─ Step 9: focusEnvironment
└─ Step 10: sharedRoomComfort + preferences
│
▼
Student submits quiz
│
▼
Frontend: submitPersonalityQuiz(formData)
├─ POST /personality/submit
├─ Headers: Authorization: Bearer {token}
└─ Body: { responses: {...} }
│
▼
Backend: personality.controller.submitPersonalityQuiz()
├─ Get user from req.user
├─ Calculate behavioral vector
├─ Calculate personality score
├─ Save PersonalityQuiz record
├─ Update User.quizCompleted = true
├─ Update User.personalityVector
└─ Update User.personalityScore
│
▼
Response: {
  user: { ..., quizCompleted: true },
  quiz: { ..., profileCompleted: true }
}
│
▼
Frontend: completeQuiz(updatedUser)
├─ Update AuthContext.user
├─ Update localStorage
└─ Navigate to /dashboard/user
│
▼
ProtectedRoute validates:
├─ user exists? ✓
├─ role === "student"? ✓
├─ quizCompleted === true? ✓
└─ Renders UserDashboard
│
▼
✅ Access Granted!
```

---

## 4. Security & Token Flow

```
┌─────────────────────────────────────┐
│   USER LOGS IN WITH CREDENTIALS     │
│   Email + Password                  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ POST /api/auth/login                        │
│ Backend verifies password vs hashed value   │
└────────┬────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ JWT Token Generated & Returned           │
│ jwt.sign({ id, role }, JWT_SECRET, {...})  │
│ Expires in 7 days                        │
└────────┬───────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Frontend stores in localStorage              │
│ localStorage.setItem("token", "eyJ...")      │
└────────┬───────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Axios Interceptor attaches to EVERY request         │
│ config.headers.Authorization = `Bearer ${token}`    │
└────────┬───────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Backend Middleware: protect                          │
│ 1. Extract token from Authorization header          │
│ 2. jwt.verify(token, JWT_SECRET)                    │
│ 3. Find user by decoded.id                          │
│ 4. Attach user to req.user                          │
│ 5. Proceed to controller                            │
└────────┬───────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Backend Middleware: allowRoles("student", ...)       │
│ 1. Check req.user.role is in allowed roles          │
│ 2. If not, return 403 Forbidden                     │
│ 3. If yes, proceed                                  │
└────────┬───────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ Request Handled by Controller                        │
│ req.user fully available and trusted                │
└────────────────────────────────────────────────────────┘

Error Cases:
├─ No token header → 401 Unauthorized
├─ Invalid token → 401 Unauthorized
├─ Expired token → 401 Unauthorized
├─ Wrong role → 403 Forbidden
└─ User not found in DB → 401 Unauthorized
```

---

## 5. Personality Vector Calculation

```
STUDENT RESPONSES:
├─ eveningRoutine: "relax_alone"
├─ weekendStyle: "balanced_mix"
├─ sharedSpaceReaction: "ignore_small_mess"
├─ noiseDuringFocus: "notice_manage"
├─ sleepPattern: "sleep_late"
├─ guestComfort: "occasionally_okay"
├─ conflictApproach: "discuss_directly"
├─ dailyRoutine: "semi_structured"
├─ focusEnvironment: "library_environment"
├─ sharedRoomComfort: "clear_routines"
├─ locationPreference: "near_campus_or_office"
├─ budgetPriority: "balanced_quality"
├─ facilityInterest: "quiet_study_space"
└─ petPreference: "neutral_about_pets"

                    ↓
         calculateBehavioralVector()

MAPPING (from personality.service.js):
├─ eveningRoutine
│  └─ { nightOwl: 2, balanced: 0, early: -2 }
│     → "relax_alone" maps to eveningRoutine:
│        eveningRoutine: early: -2, balanced: 0, nightOwl: 2
│        ├─ hangout_group → social → 2
│        ├─ small_group → balanced → 0
│        ├─ relax_alone → introvert → -2 ✓
│        └─ productive → focused → (map check)
│
├─ weekendStyle
│  └─ { social: 2, balanced: 0, solo: -2 }
│     → "balanced_mix" = 0 ✓
│
└─ ... (continue for all 14)

RESULT VECTOR:
[-2, 0, -2, 0, 2, -2, 2, 0, 0, 0, 1, 1, 0, 0]
 ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑
 1  2  3  4  5  6  7  8  9 10 11 12 13 14

CALCULATE PERSONALITY SCORE:
├─ Sum all vector values: -2+0-2+0+2-2+2+0+0+0+1+1+0+0 = 0
├─ Calculate average: 0 / 14 = 0
├─ Add 2 (shift to positive): 0 + 2 = 2
├─ Multiply by scale factor: 2 * (100/4) = 50
└─ Result: personalityScore = 50 out of 100

STORED IN DATABASE:
├─ User collection:
│  ├─ personalityVector: [-2, 0, -2, 0, 2, -2, 2, 0, 0, 0, 1, 1, 0, 0]
│  ├─ personalityScore: 50
│  └─ budgetPreference: 1 (from budgetPriority mapping)
│
└─ PersonalityQuiz collection:
   ├─ responses: { eveningRoutine, weekendStyle, ... }
   ├─ personalityVector: [-2, 0, -2, 0, 2, -2, 2, 0, 0, 0, 1, 1, 0, 0]
   └─ personalityScore: 50

✓ Ready for matching algorithm!
```

---

These diagrams show the complete architecture and flow of the Intellistay Hostel Recommendation System!
