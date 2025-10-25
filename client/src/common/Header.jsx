import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // ✅ define navigate first

  return (
    <header className="w-full bg-gray-900/60 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">⚔️</div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-yellow-400">
              Anime Clash
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6 text-gray-300">
            <button
              onClick={() => navigate("/")}
              className="hover:text-yellow-300 transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/allCards")}
              className="hover:text-yellow-300 transition"
            >
              Cards
            </button>
            <button
              onClick={() => navigate("/")}
              className="hover:text-yellow-300 transition"
            >
              Matches
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
