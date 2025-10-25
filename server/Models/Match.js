// models/Match.js
import mongoose from "mongoose";

const teamSlotSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["captain", "viceCaptain", "tank", "healer", "support"],
      required: true,
    },
    character: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Character",
      required: false,
    }, // null until assigned
  },
  { _id: false }
);

const embeddedPlayerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // team is fixed-size 5 for fast array ops
    team: {
      type: [teamSlotSchema],
      default: [
        { role: "captain", character: null },
        { role: "viceCaptain", character: null },
        { role: "tank", character: null },
        { role: "healer", character: null },
        { role: "support", character: null },
      ],
    },
    filledCount: { type: Number, default: 0 }, // quick check for team completion
    skipUsed: { type: Boolean, default: false },
    swapUsed: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false }, // locks in for battle phase
    score: { type: Number, default: 0 }, // computed at battle
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    // players[0] and players[1] always present once match is started
    players: { type: [embeddedPlayerSchema], validate: (v) => v.length <= 2 },

    // deck holds character IDs in shuffled order. Small arrays ok.
    deck: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
    usedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],

    // turn: 0 or 1 -> index into players array
    currentTurnIndex: { type: Number, default: 0, min: 0, max: 1 },

    // phase: waiting -> drawing -> teambuilding -> battle -> completed
    phase: {
      type: String,
      enum: ["waiting", "drawing", "teambuilding", "battle", "completed"],
      default: "waiting",
      index: true,
    },

    // winner user id if completed
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // keep small for quick writes and reads
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/* Indexes for queries */
matchSchema.index({ phase: 1, createdAt: 1 }); // find waiting / active matches fast
matchSchema.index({ "players.user": 1 }); // find matches by user quickly

// Reuse existing model if compiled (prevents OverwriteModelError when reloading)
export const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);
