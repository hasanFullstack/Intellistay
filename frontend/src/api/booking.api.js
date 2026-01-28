import api from "./axios";

export const createBooking = (data) => api.post("/bookings", data);
export const getUserBookings = () => api.get("/bookings/my");
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);
