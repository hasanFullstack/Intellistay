import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Initialize user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    console.log("AuthContext - Stored user from sessionStorage:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("AuthContext - Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
  }, []);

  const login = (data) => {
    console.log("AuthContext - Login called with data:", data);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    console.log("AuthContext - Setting user to:", data.user);
    setUser(data.user);

    // Show personality quiz for students who haven't completed it
    if (data.user.role === "student" && !data.user.quizCompleted) {
      console.log("AuthContext - Triggering personality quiz for new student");
      setShowQuiz(true);
    }
  };

  const logout = () => {
    console.log("AuthContext - Logout called");
    sessionStorage.clear();
    setUser(null);
    setShowQuiz(false);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
  };

  const completeQuiz = (updatedUser) => {
    // Update user with completed quiz status
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setShowQuiz(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, showQuiz, closeQuiz, completeQuiz }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
