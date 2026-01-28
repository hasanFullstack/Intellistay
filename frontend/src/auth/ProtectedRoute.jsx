import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.role?.toLowerCase() !== role.toLowerCase())
    return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
