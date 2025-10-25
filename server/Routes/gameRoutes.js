import express from "express";
import {
  drawCard,
  assignCard,
  skipCard,
  swapCards,
  startBattle,
} from "../Controllers/gameController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/:matchId/draw", requireAuth, drawCard);
router.post("/:matchId/assign", requireAuth, assignCard);
router.post("/:matchId/skip", requireAuth, skipCard);
router.post("/:matchId/swap", requireAuth, swapCards);
router.post("/:matchId/battle", requireAuth, startBattle);

export default router;
