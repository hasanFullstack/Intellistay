import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import "./App.css";

import Navbar from "../components/Navbar";
import Home from "./pages/Home";
import UserDashboard from "./pages/user/UserDashborad";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AuthModal from "./pages/AuthModal";

import { useState } from "react";

const AppWrapper = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar openAuth={() => setAuthOpen(true)} />
        {authOpen && (
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        )}

        <Routes>
          <Route path="/" element={<Home />} />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppWrapper;
