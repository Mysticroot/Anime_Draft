import React from "react";
import reactLogo from "./assets/react.svg"; // ✅ Use your React logo for testing

const tierColors = {
  rare: "from-blue-400 via-blue-500 to-indigo-600",
  epic: "from-purple-500 via-indigo-500 to-blue-600",
  legendary: "from-yellow-400 via-orange-500 to-red-500",
};

const CharacterCard = ({ character }) => {
  const { name, anime, tier, scores } = character;

  return (
    <div className="relative group rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 bg-gray-900 shadow-lg border border-gray-800 hover:border-gray-600 w-full max-w-full">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${tierColors[tier]} blur-xl opacity-30 animate-pulse-glow`}
        />
      </div>

      {/* Card frame */}
      <div
        className={`relative bg-gradient-to-br ${tierColors[tier]} p-[2px] rounded-xl`}
      >
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
          {/* Portrait */}
          <div className="relative h-36 overflow-hidden">
            <img
              src={reactLogo} // ✅ Always use react.svg for testing
              alt={name}
              className="w-full h-full object-cover bg-black/30 transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Info */}
          <div className="p-3 text-white space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold truncate">{name}</h2>
              <span
                className={`text-xs px-2 py-1 rounded-full uppercase font-semibold ${
                  tier === "legendary"
                    ? "bg-yellow-500 text-black"
                    : tier === "epic"
                    ? "bg-purple-600"
                    : "bg-blue-600"
                }`}
              >
                {tier}
              </span>
            </div>
            <p className="text-sm text-gray-400 capitalize">
              {anime.replace("_", " ")}
            </p>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mt-2">
              {Object.entries(scores || {}).map(([role, value]) => (
                <p key={role} className="flex justify-between">
                  <span className="text-gray-300">{role}</span>
                  <span className="text-yellow-400 font-semibold">
                    {value ?? "—"}
                  </span>
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-[11px] text-gray-300 text-center py-2 border-t border-gray-800 mt-3 tracking-wide italic">
            {tier === "legendary" ? (
              <span className="text-yellow-400 font-semibold">
                ✨ A Legend Among Heroes ✨
              </span>
            ) : tier === "epic" ? (
              <span className="text-purple-400 font-semibold">
                🌌 Known Across the Lands
              </span>
            ) : (
              <span className="text-blue-400 font-semibold">
                💠 A Rare but Fierce Fighter
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
