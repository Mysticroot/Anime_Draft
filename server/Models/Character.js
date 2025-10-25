// models/Character.js
import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    captain: { type: Number, required: true },
    viceCaptain: { type: Number, required: true },
    tank: { type: Number, required: true },
    healer: { type: Number, required: true },
    support: { type: Number, required: true },
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    anime: {
      type: String,
      enum: ["one_piece", "naruto", "bleach"],
      required: true,
    },
    portrait_url: { type: String, required: true },
    tier: {
      type: String,
      enum: ["rare", "epic", "legendary"],
      default: "rare",
    },
    scores: { type: scoreSchema, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

characterSchema.index({ tier: 1 });
// Reuse existing model if compiled (prevents OverwriteModelError when reloading)
export const Character =
  mongoose.models.Character || mongoose.model("Character", characterSchema);
