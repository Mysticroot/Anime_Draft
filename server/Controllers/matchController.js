import { Match } from "../Models/Match.js";
import { Character } from "../Models/Character.js";

export const createMatch = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get random shuffled deck
    const characters = await Character.find({});
    const shuffled = characters.sort(() => Math.random() - 0.5);

    const match = await Match.create({
      players: [{ user: userId }],
      deck: shuffled.map((c) => c._id),
      phase: "waiting",
    });

    res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create match" });
  }
};

export const joinMatch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ error: "Match not found" });
    if (match.players.length >= 2)
      return res.status(400).json({ error: "Match already full" });

    match.players.push({ user: userId });
    match.phase = "drawing";
    await match.save();

    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to join match" });
  }
};

export const getMatchDetails = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Find match and populate characters for readable names
    const match = await Match.findById(matchId)
      .populate("players.user", "username email")
      .populate("deck", "name anime")
      .populate("usedCards", "name anime");

    if (!match) {
      return res
        .status(404)
        .json({ success: false, message: "Match not found" });
    }

    // Prepare simplified response data
    const deckNames = match.deck.map((c) => c.name);
    const players = match.players.map((p) => p.user?._id);

    res.status(200).json({
      success: true,
      data: {
        matchId: match._id,
        players,
        status:
          match.phase === "waiting" && players.length === 2
            ? "ready"
            : match.phase,
        deck: deckNames,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching match details:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
