import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["Single", "Shared", "Deluxe"],
      required: true,
    },
    totalBeds: {
      type: Number,
      required: true,
    },
    availableBeds: {
      type: Number,
      required: true,
    },
    pricePerBed: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Co-ed"],
      default: "Co-ed",
    },
    images: [String],
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
