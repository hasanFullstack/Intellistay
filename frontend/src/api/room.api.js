import api from "./axios";

export const addRoom = (hostelId, data) =>
  api.post(`/rooms/hostel/${hostelId}`, data);

export const getRoomsByHostel = (hostelId) =>
  api.get(`/rooms/hostel/${hostelId}`);

export const getRoomById = (roomId) => api.get(`/rooms/${roomId}`);

export const updateRoom = (roomId, data) => api.put(`/rooms/${roomId}`, data);

export const deleteRoom = (roomId) => api.delete(`/rooms/${roomId}`);
