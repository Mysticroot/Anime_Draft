import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: integrate real API later
    console.log("Sign In:", form);
    navigate("/"); // redirect after success
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-black text-white px-4">
      <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          🔥 Welcome Back, Warrior
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:scale-105 transform transition"
          >
            ⚔️ Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-yellow-400 hover:underline"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}
