import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Route Imports
import authRoutes from "./Routes/authRoutes.js";
import matchRoutes from "./Routes/MatchRoutes.js";
import gameRoutes from "./Routes/gameRoutes.js";
import characterRoutes from "./Routes/CharacterRoutes.js"; // ✅ add this

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] })); // explicit CORS config
app.use(express.json({ limit: "10mb" })); // handles large JSON payloads
app.use(morgan("dev"));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/characters", characterRoutes); // ✅ add character routes

// --- Health Check ---
app.get("/", (req, res) => {
  res.status(200).json({ message: "Anime Frat backend up ✅" });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global Error Handler (optional best practice) ---
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;
