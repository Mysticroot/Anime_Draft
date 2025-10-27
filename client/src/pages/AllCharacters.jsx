import React from "react";
import { useQuery } from "@tanstack/react-query";
import CharacterCard from "../CharacterCard";

import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_URL;

async function fetchCharacters() {
  const res = await fetch(`${API_BASE}/characters`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  const data = await res.json();
  return data.data;
}

export default function AllCharacters() {
  const {
    data: characters = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 text-center mb-10 drop-shadow-[0_0_5px_rgba(255,255,0,0.4)]">
          All Characters
        </h2>

        {isLoading && (
          <div className="text-center text-gray-400 text-lg animate-pulse">
            Loading characters...
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500 text-lg">
            ⚠️ {error.message}
          </div>
        )}

        {!isLoading && !isError && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {characters.map((c) => (
              <motion.div
                key={c._id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CharacterCard character={c} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
