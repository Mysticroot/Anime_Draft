import React from "react";
import { FaDiscord, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900/80 backdrop-blur-md border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Brand + About */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-400 mb-3">
            ⚔️ Anime Clash
          </h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Step into the battlefield where legends rise and heroes clash.
            Unleash your anime warriors, challenge rivals, and dominate the
            arena.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/allCards"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Cards
              </a>
            </li>
            <li>
              <a
                href="/battle"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                Create Match
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-yellow-300 transition-colors duration-200"
              >
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            Contact Us
          </h3>
          <p className="text-sm text-gray-400 mb-2">
            📍 7th Floor, Neo Tower, Tokyo Street, Akihabara, Japan
          </p>
          <p className="text-sm text-gray-400 mb-4">✉️ support@animeclash.gg</p>

          <div className="flex items-center gap-5 text-lg">
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition"
            >
              <FaDiscord />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="https://animeclash.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition"
            >
              <FaGlobe />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500 bg-gray-950/70">
        <p>
          ⚡ Built for warriors of the arena —{" "}
          <span className="text-yellow-400 font-semibold">Anime Clash</span> ©{" "}
          {new Date().getFullYear()} | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
