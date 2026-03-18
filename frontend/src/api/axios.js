import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor — attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    // Auto logout on 401 (expired/invalid token)
    if (status === 401) {
      const currentPath = window.location.pathname;
      // Don't toast on login/register attempts (handled locally)
      if (!currentPath.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/";
      }
    }

    // Rate limited
    if (status === 429) {
      toast.warning("Too many requests. Please slow down.");
    }

    // Server error
    if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
