import express from "express";
import {
  signup,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp
} from "../Controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

export default router;
