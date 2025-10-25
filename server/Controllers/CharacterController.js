import {Character} from "../Models/Character.js";

/**
 * @desc Get all characters
 * @route GET /api/characters
 * @access Public
 */
export const getAllCharacters = async (req, res) => {
  try {
    const characters = await Character.find();
    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * @desc Get characters by anime
 * @route GET /api/characters/anime/:anime
 * @access Public
 */
export const getCharactersByAnime = async (req, res) => {
  try {
    const { anime } = req.params;
    const characters = await Character.find({ anime: anime.toLowerCase() });

    if (!characters.length)
      return res
        .status(404)
        .json({ success: false, message: `No characters found for ${anime}` });

    res.status(200).json({ success: true, data: characters });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * @desc Add new character
 * @route POST /api/characters
 * @access Admin
 */
export const createCharacter = async (req, res) => {
  try {
    const { name, anime, image, scores } = req.body;

    if (!name || !anime || !scores)
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });

    const newCharacter = await Character.create({
      name,
      anime: anime.toLowerCase(),
      image,
      scores,
    });

    res.status(201).json({ success: true, data: newCharacter });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * @desc Update a character
 * @route PUT /api/characters/:id
 * @access Admin
 */
export const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Character.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

/**
 * @desc Delete a character
 * @route DELETE /api/characters/:id
 * @access Admin
 */
export const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Character.findByIdAndDelete(id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Character not found" });

    res
      .status(200)
      .json({ success: true, message: "Character deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
