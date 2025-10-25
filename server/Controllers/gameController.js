import { Match } from "../Models/Match.js";
import { BattleLog } from "../Models/BattleLog.js";
import { Character } from "../Models/Character.js";

const getOpponentIndex = (i) => (i === 0 ? 1 : 0);

// Draw a random card from the remaining deck
export const drawCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await Match.findById(matchId)
      .populate("players.user")
      .populate("deck");

    const playerIndex = match.players.findIndex((p) =>
      p.user._id.equals(userId)
    );
    if (playerIndex === -1)
      return res.status(403).json({ error: "Not a player" });

    if (match.currentTurnIndex !== playerIndex)
      return res.status(400).json({ error: "Not your turn" });

    const player = match.players[playerIndex];

    if (match.phase !== "drawing")
      return res.status(400).json({ error: "Not in drawing phase" });

    if (match.deck.length === 0)
      return res.status(400).json({ error: "Deck empty" });

    // draw random card
    const randomIndex = Math.floor(Math.random() * match.deck.length);
    const drawnCardId = match.deck[randomIndex];
    const drawnCard = await Character.findById(drawnCardId);

    // remove card from deck
    match.deck.splice(randomIndex, 1);
    match.usedCards.push(drawnCard._id);

    await match.save();

    await BattleLog.create({
      matchId,
      actorUser: userId,
      action: "draw",
      payload: { cardId: drawnCard._id },
    });

    res.json({ drawnCard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Draw failed" });
  }
};

// Assign a drawn card to a role
export const assignCard = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { cardId, role } = req.body;
    const userId = req.user.id;

    const match = await Match.findById(matchId).populate("players.user");

    const playerIndex = match.players.findIndex((p) =>
      p.user._id.equals(userId)
    );
    const player = match.players[playerIndex];
    if (!player) return res.status(403).json({ error: "Not your match" });

    const slot = player.team.find((r) => r.role === role);
    if (!slot) return res.status(400).json({ error: "Invalid role" });
    if (slot.character) return res.status(400).json({ error: "Role filled" });

    slot.character = cardId;
    player.filledCount += 1;

    // Next turn only if player didn’t use skip
    match.currentTurnIndex = getOpponentIndex(playerIndex);

    if (player.filledCount === 5) player.isReady = true;
    await match.save();

    await BattleLog.create({
      matchId,
      actorUser: userId,
      action: "assign",
      payload: { cardId, role },
    });

    res.json({ message: "Card assigned", match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assign failed" });
  }
};

// Skip a card
export const skipCard = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findById(matchId).populate("players.user");
    const playerIndex = match.players.findIndex((p) =>
      p.user._id.equals(userId)
    );
    const player = match.players[playerIndex];
    if (!player) return res.status(403).json({ error: "Not your match" });

    if (player.skipUsed)
      return res.status(400).json({ error: "Skip already used" });

    player.skipUsed = true;
    // allow immediate new draw after skip
    await match.save();

    await BattleLog.create({
      matchId,
      actorUser: userId,
      action: "skip",
    });

    res.json({ message: "Skip used, draw again allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Skip failed" });
  }
};

// Swap two roles within your team
export const swapCards = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { roleA, roleB } = req.body;
    const userId = req.user.id;

    const match = await Match.findById(matchId).populate("players.user");
    const playerIndex = match.players.findIndex((p) =>
      p.user._id.equals(userId)
    );
    const player = match.players[playerIndex];

    if (!player) return res.status(403).json({ error: "Not your match" });
    if (player.swapUsed || player.skipUsed)
      return res
        .status(400)
        .json({ error: "Cannot swap (already used skip or swap)" });

    const slotA = player.team.find((r) => r.role === roleA);
    const slotB = player.team.find((r) => r.role === roleB);

    if (!slotA || !slotB)
      return res.status(400).json({ error: "Invalid roles" });

    [slotA.character, slotB.character] = [slotB.character, slotA.character];
    player.swapUsed = true;
    await match.save();

    await BattleLog.create({
      matchId,
      actorUser: userId,
      action: "swap",
      payload: { roleA, roleB },
    });

    res.json({ message: "Roles swapped successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Swap failed" });
  }
};

// Start the battle
export const startBattle = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findById(matchId)
      .populate("players.team.character")
      .populate("players.user");

    if (match.players.some((p) => p.filledCount < 5))
      return res
        .status(400)
        .json({ error: "All players must fill team first" });

    match.phase = "battle";

    // Calculate scores
    for (const player of match.players) {
      let total = 0;
      for (const slot of player.team) {
        const char = slot.character;
        if (char?.scores?.[slot.role]) total += char.scores[slot.role];
      }
      player.score = total;
    }

    const [p1, p2] = match.players;
    match.winner = p1.score > p2.score ? p1.user : p2.user;
    match.phase = "completed";

    await match.save();

    res.json({
      message: "Battle completed",
      winner: match.winner,
      scores: match.players.map((p) => ({ user: p.user, score: p.score })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Battle failed" });
  }
};
