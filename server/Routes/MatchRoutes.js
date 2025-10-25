import express from "express";
import { createMatch, joinMatch ,getMatchDetails} from "../Controllers/matchController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/create", requireAuth, createMatch);
router.post("/join/:matchId", requireAuth, joinMatch);
router.get("/:matchId", requireAuth, getMatchDetails);

export default router;
