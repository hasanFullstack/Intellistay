import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";
import "./index.css";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import PersonalityQuiz from "../components/PersonalityQuiz";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
// import Rooms from "./pages/Rooms";
import Hostels from "./pages/Hostels";
import RoomDetail from "./pages/RoomDetail";
import UserDashboard from "./pages/user/UserDashborad";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AuthModal from "./pages/AuthModal";
import About from "../components/About";
import Rooms from "../components/Rooms";

import { useState } from "react";

const AppContent = ({ authOpen, setAuthOpen }) => {
  const { showQuiz, closeQuiz, completeQuiz, user } = useAuth();

  return (
    <>
      <Navbar openAuth={() => setAuthOpen(true)} />
      {authOpen && (
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      )}

      {showQuiz && user && (
        <PersonalityQuiz
          userId={user._id}
          onComplete={completeQuiz}
          onClose={closeQuiz}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/hostels" element={<Hostels />} />
        <Route path="/room/:roomId/:hostelId" element={<RoomDetail />} />

        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute role="student">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/rooms" element={<Rooms />} />
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
