import React from "react";
import { useNavigate } from "react-router-dom";
import CharacterCard from "../CharacterCard";

export default function PlayerDashboard() {
  const navigate = useNavigate();

  // example player data - replace with real data when available
  const player = {
    username: "Luffy",
    avatar: "https://i.pravatar.cc/150?img=12",
    rank: "Gold IV",
    level: 27,
    wins: 42,
    losses: 18,
    winRate: 70,
  };

  // small dummy preview cards (you can replace with real data)
  const previewCards = [
    {
      _id: "a1",
      name: "Ace",
      tier: "rare",
      anime: "one_piece",
      portrait_url: "https://i.pravatar.cc/300?img=1",
    },
    {
      _id: "b2",
      name: "Naruto",
      tier: "epic",
      anime: "naruto",
      portrait_url: "https://i.pravatar.cc/300?img=2",
    },
    {
      _id: "c3",
      name: "Ichigo",
      tier: "legendary",
      anime: "bleach",
      portrait_url: "https://i.pravatar.cc/300?img=3",
    },
    {
      _id: "d4",
      name: "Kakashi",
      tier: "rare",
      anime: "naruto",
      portrait_url: "https://i.pravatar.cc/300?img=4",
    },
  ];

  function handleCreateMatch() {
    // navigate to battle and pass player name in state
    navigate("/battle", { state: { playerName: player.username } });
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 to-black text-white">
     

      {/* Main */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column - Profile & Actions */}
          <aside className="lg:col-span-4">
            <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 shadow-md">
              <div className="flex items-center gap-4">
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-20 h-20 rounded-full ring-2 ring-yellow-400/40"
                />
                <div>
                  <h2 className="text-xl font-bold">{player.username}</h2>
                  <p className="text-sm text-gray-400">
                    {player.rank} • Level {player.level}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-sm text-gray-400">Wins</div>
                  <div className="text-lg font-semibold text-green-400">
                    {player.wins}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Losses</div>
                  <div className="text-lg font-semibold text-red-400">
                    {player.losses}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Winrate</div>
                  <div className="text-lg font-semibold text-yellow-400">
                    {player.winRate}%
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCreateMatch}
                  className="w-full px-4 py-3 bg-yellow-400 text-white rounded-lg font-semibold shadow hover:scale-105 transform transition"
                >
                  ⚔️ Create Match
                </button>

                <button
                  onClick={() => navigate("/allCards")}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-800 transition"
                >
                  📦 My Collection
                </button>

                <button className="w-full px-4 py-3 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-800 transition">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </aside>

          {/* Right column - Cards preview & recent matches */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Card Collection Preview</h3>
                <div className="text-sm text-gray-400">
                  Showing 4 of your cards
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previewCards.map((c) => (
                  <div key={c._id} className="mx-auto">
                    <CharacterCard character={c} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Recent Matches</h3>
                <div className="text-sm text-gray-400">Last 5</div>
              </div>

              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <div className="font-semibold">Victory vs Zoro</div>
                    <div className="text-xs text-gray-400">
                      2 hours ago • +12 XP
                    </div>
                  </div>
                  <div className="text-sm text-green-400 font-bold">Win</div>
                </li>
                <li className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <div className="font-semibold">Defeat vs Sanji</div>
                    <div className="text-xs text-gray-400">
                      1 day ago • +5 XP
                    </div>
                  </div>
                  <div className="text-sm text-red-400 font-bold">Loss</div>
                </li>
                <li className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div>
                    <div className="font-semibold">Draw vs Buggy</div>
                    <div className="text-xs text-gray-400">
                      3 days ago • +2 XP
                    </div>
                  </div>
                  <div className="text-sm text-yellow-400 font-bold">Draw</div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

     
    </div>
  );
}
