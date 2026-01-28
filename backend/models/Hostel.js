import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: String,
    amenities: [String],
    images: [String],
    rules: String,
    environmentScore: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Hostel", hostelSchema);
