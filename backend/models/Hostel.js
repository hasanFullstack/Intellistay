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
    viewCount: {
      type: Number,
      default: 0,
    },
    environmentScore: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true },
);

hostelSchema.index({ ownerId: 1 });
hostelSchema.index({ viewCount: -1 });
hostelSchema.index({ createdAt: -1 });

export default mongoose.model("Hostel", hostelSchema);
