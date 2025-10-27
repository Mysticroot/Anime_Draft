import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email) {
      alert("Please enter your email first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while sending OTP");
    }
  };


  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpVerified(true);
        alert("✅ Email verified successfully!");
      } else {
        alert(data.error || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black text-white px-4">
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          ⚡ Join the Arena
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="Enter a unique username"
            />
          </div>

          {/* Email + Send OTP */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                placeholder="Enter your email"
              />
              <button
                type="button"
                onClick={sendOtp}
                className={`px-3 py-2 rounded-lg font-semibold ${
                  otpSent
                    ? "bg-green-500 text-black cursor-default"
                    : "bg-yellow-400 text-black hover:scale-105 transition"
                }`}
                disabled={otpSent}
              >
                {otpSent ? "Sent" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Verification */}
          {otpSent && (
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Verify OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                  placeholder="Enter OTP"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    otpVerified
                      ? "bg-green-500 text-black cursor-default"
                      : "bg-yellow-400 text-black hover:scale-105 transition"
                  }`}
                  disabled={otpVerified}
                >
                  {otpVerified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="Create a password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:scale-105 transform transition"
          >
            🚀 Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-yellow-400 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
