// models/BattleLog.js (optional)
import mongoose from "mongoose";
const battleLogSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
    index: true,
  },
  turn: Number,
  actorUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, // "draw", "assign", "skip", "swap", ...
  payload: Object,
  createdAt: { type: Date, default: Date.now },
});
export const BattleLog = mongoose.model("BattleLog", battleLogSchema);
