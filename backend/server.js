import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import hostelRoutes from "./routes/hostel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import personalityRoutes from "./routes/personality.routes.js";
import hostelEnvironmentRoutes from "./routes/hostelEnvironment.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/personality", personalityRoutes);
app.use("/api/hostel-environment", hostelEnvironmentRoutes);

app.listen(
  process.env.PORT,
  () => console.log(`Server running on port ${process.env.PORT}`),
  console.log(bcryptjs.hashSync("admin123", 10)),
);
