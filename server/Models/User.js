// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    profileImage: { type: String, default: "/default-avatar.png" },

    // Denormalized quick stats
    stats: {
      matchesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
    },

    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

// Avoid OverwriteModelError when using hot-reload / nodemon: reuse existing model if already compiled
export const User = mongoose.models.User || mongoose.model("User", userSchema);
