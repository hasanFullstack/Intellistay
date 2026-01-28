import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "owner", "admin"], // 👈 admin added
      default: "student",
    },

    personalityScore: {
      type: Number,
      default: 50,
    },

    isVerified: {
      type: Boolean,
      default: false, // owners verified by admin
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
