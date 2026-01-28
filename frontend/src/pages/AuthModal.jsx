import { useState } from "react";
import { registerApi, loginApi } from "../api/auth.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./style/auth.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ role: "student" });

  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const submit = async () => {
    try {
      if (isLogin) {
        const res = await loginApi(form);
        login(res.data);
        navigate(
          res.data.user.role === "owner"
            ? "/dashboard/owner"
            : "/dashboard/user",
        );
      } else {
        await registerApi(form);
        alert("Registered successfully. Please login now.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isLogin ? "Login to Your Account" : "Create Account"}</h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Role select only for registration */}
        {!isLogin && (
          <>
            <input
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="owner">Owner</option>
            </select>
          </>
        )}

        <button onClick={submit}>{isLogin ? "Login" : "Register"}</button>

        <div className="switch-text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "New here? Create an account"
            : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
