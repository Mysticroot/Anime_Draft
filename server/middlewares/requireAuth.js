import jwt from "jsonwebtoken";
import { User } from "../Models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: "Invalid user" });

    req.user = { id: user._id, username: user.username, email: user.email };
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};
