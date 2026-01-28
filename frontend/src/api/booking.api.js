import api from "./axios";

export const createBooking = (data) => api.post("/bookings", data);
export const getUserBookings = (userId) => api.get("/bookings/my");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Owner booking management
export const getOwnerBookings = () => api.get("/bookings/owner/all");
export const acceptBooking = (id) => api.put(`/bookings/${id}/accept`);
export const rejectBooking = (id) => api.put(`/bookings/${id}/reject`);
