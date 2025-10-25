import express from "express";
import {
  getAllCharacters,
  getCharactersByAnime,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../Controllers/CharacterController.js";

const router = express.Router();

// Public routes
router.get("/", getAllCharacters);
router.get("/anime/:anime", getCharactersByAnime);

// Admin routes
router.post("/", createCharacter);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);

export default router;
