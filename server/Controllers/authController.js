import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";

import nodemailer from "nodemailer";
import crypto from "crypto";
import { OTP } from "../Models/otp.js"; // create a new OTP model

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwt";

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, username, passwordHash });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // TODO: integrate with real mailer
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({
      message: "Reset link generated (mock)",
      resetLink: `/reset-password/${resetToken}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate reset link" });
  }
};


// ⚡ send OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    // Generate random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB with expiration (5 min)
    await OTP.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Configure email sender (use real credentials in prod)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"Arena Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for verification is ${otpCode}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ⚡ verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp });

    if (!record) return res.status(400).json({ error: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    await OTP.deleteMany({ email }); // remove old OTPs
    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};