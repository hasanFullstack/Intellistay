import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";

import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Rooms from "./pages/Rooms";
import Hostels from "./pages/Hostels";
import HostelRooms from "./pages/HostelRooms";
import RoomDetail from "./pages/RoomDetail";
import UserDashboard from "./pages/user/UserDashborad";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import PersonalityQuizPage from "./pages/PersonalityQuizPage";
import AuthModal from "./pages/AuthModal";
import NotFound from "./pages/NotFound";

import { useState } from "react";

const AppContent = ({ authOpen, setAuthOpen }) => {
  const { user } = useAuth();

  return (
    <>
      <Navbar openAuth={() => setAuthOpen(true)} />
      {authOpen && (
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthModal isOpen={true} onClose={() => {}} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/hostels" element={<Hostels />} />
        <Route path="/hostels/:hostelId/rooms" element={<HostelRooms />} />
        <Route path="/room/:roomId/:hostelId" element={<RoomDetail />} />

        {/* Personality Quiz - only for students */}
        <Route
          path="/personality-quiz"
          element={
            <ProtectedRoute role="student" requiresQuiz={false}>
              <PersonalityQuizPage />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard - requires completed quiz */}
        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute role="student" requiresQuiz={true}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Owner Dashboard */}
        <Route
          path="/dashboard/owner"
          element={
            <ProtectedRoute role="owner" requiresQuiz={false}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Owner environment quiz is handled inline in dashboard modal */}

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const AppWrapper = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent authOpen={authOpen} setAuthOpen={setAuthOpen} />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppWrapper;
