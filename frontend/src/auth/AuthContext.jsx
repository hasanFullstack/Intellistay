import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("AuthContext - Stored user from localStorage:", storedUser);
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
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    console.log("AuthContext - Setting user to:", data.user);
    setUser(data.user);
  };

  const logout = () => {
    console.log("AuthContext - Logout called");
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
