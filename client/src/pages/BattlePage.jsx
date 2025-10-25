import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// framer-motion removed (not used) to avoid unused import
import CharacterCard from "../CharacterCard";
import reactLogo from "../assets/react.svg";

const ROLES = ["captain", "viceCaptain", "tank", "healer", "support"];

// helper to build a larger deck for demo
function buildDeck() {
  const base = [
    {
      _id: "1",
      name: "Ace",
      tier: "rare",
      anime: "one_piece",
      portrait_url: reactLogo,
    },
    {
      _id: "2",
      name: "Naruto",
      tier: "epic",
      anime: "naruto",
      portrait_url: reactLogo,
    },
    {
      _id: "3",
      name: "Ichigo",
      tier: "legendary",
      anime: "bleach",
      portrait_url: reactLogo,
    },
    {
      _id: "4",
      name: "Kakashi",
      tier: "rare",
      anime: "naruto",
      portrait_url: reactLogo,
    },
    {
      _id: "5",
      name: "Luffy",
      tier: "epic",
      anime: "one_piece",
      portrait_url: reactLogo,
    },
  ];
  // duplicate a few times
  return Array(5)
    .fill(base)
    .flat()
    .map((c, i) => ({ ...c, _id: `${c._id}-${i}` }))
    .sort(() => Math.random() - 0.5);
}

function Slot({ role, card, onDrop, disabled }) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "CARD",
    drop: (item) => onDrop(role, item.card),
    canDrop: () => !disabled,
    collect: (m) => ({ isOver: m.isOver() }),
  });

  return (
    <div
      ref={dropRef}
      className={`rounded-xl p-2 w-full h-60 flex flex-col justify-between border ${
        isOver
          ? "border-blue-400 bg-blue-900/10"
          : "border-gray-700 bg-gray-800/40"
      }`}
    >
      <div className="text-sm text-gray-300 capitalize">{role}</div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {card ? (
          <div className="w-full max-w-[180px]">
            <CharacterCard character={card} />
          </div>
        ) : (
          <div className="text-gray-500">Empty</div>
        )}
      </div>
    </div>
  );
}

function Draggable({ card }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "CARD",
    item: { card },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  return (
    <div
      ref={dragRef}
      className={`w-full max-w-[200px] ${isDragging ? "opacity-50" : ""}`}
    >
      <CharacterCard character={card} />
    </div>
  );
}

export default function BattlePage() {
  const location = useLocation();
  const playerName = location?.state?.playerName || "You";

  const initialDeck = useMemo(() => buildDeck(), []);
  const [deck, setDeck] = useState(initialDeck);

  const [turn, setTurn] = useState(0); // 0 = local player, 1 = opponent

  const [players, setPlayers] = useState([
    {
      id: 0,
      name: playerName,
      currentCard: null,
      team: {},
      actionsUsed: { skip: false, alter: false },
    },
    {
      id: 1,
      name: "Opponent",
      currentCard: null,
      team: {},
      actionsUsed: { skip: false, alter: false },
    },
  ]);

  function drawFor(playerIndex) {
    // Rules:
    // - only the current player can draw
    // - can't draw if player already has a current drawn card
    // - can't draw if team is full
    if (turn !== playerIndex) return;
    const pl = players[playerIndex];
    if (!pl) return;
    if (deck.length === 0) return;
    if (pl.currentCard) return; // must use or skip before drawing again
    const assignedCount = Object.keys(pl.team || {}).length;
    if (assignedCount >= ROLES.length) return; // team full

    const [next, ...rest] = deck;
    setDeck(rest);
    setPlayers((p) =>
      p.map((pl, i) => (i === playerIndex ? { ...pl, currentCard: next } : pl))
    );
  }

  function skipFor(playerIndex) {
    // Only allowed if player has a drawn card and skip not used
    const pl = players[playerIndex];
    if (!pl) return;
    if (!pl.currentCard) return;
    if (pl.actionsUsed.skip) return;
    const returned = [pl.currentCard];
    setDeck((d) => [...d, ...returned]);
    setPlayers((p) =>
      p.map((pl, i) =>
        i === playerIndex
          ? {
              ...pl,
              currentCard: null,
              actionsUsed: { ...pl.actionsUsed, skip: true },
            }
          : pl
      )
    );
    // Do NOT change turn here — skip allows the same player to draw again once
  }

  function assignTo(playerIndex, role, card) {
    // only allow assignment of card if owner matches or it's a current drawn card
    setPlayers((p) =>
      p.map((pl, i) => {
        if (i !== playerIndex) return pl;
        const team = { ...pl.team, [role]: card };
        // if the card was in currentCard, clear it
        const currentCard =
          pl.currentCard && pl.currentCard._id === card._id
            ? null
            : pl.currentCard;
        return { ...pl, team, currentCard };
      })
    );
    setTurn((t) => (t === 0 ? 1 : 0));
  }

  // swapRoles removed (not used yet)

  function endTurn() {
    setTurn((t) => (t === 0 ? 1 : 0));
  }

  // alter flow removed for now; will add an explicit UI next if desired
  // Alter modal state
  const [alterModal, setAlterModal] = useState({
    open: false,
    player: null,
    roleA: "",
    roleB: "",
  });

  function openAlterModal(playerIndex) {
    setAlterModal({ open: true, player: playerIndex, roleA: "", roleB: "" });
  }

  function closeAlterModal() {
    setAlterModal({ open: false, player: null, roleA: "", roleB: "" });
  }

  function confirmAlter() {
    const { player, roleA, roleB } = alterModal;
    if (player === null) return;
    if (!roleA || !roleB || roleA === roleB) return;
    // Only allow if skip not used
    const pl = players[player];
    if (!pl || pl.actionsUsed.skip) return;
    setPlayers((ps) =>
      ps.map((p, i) => {
        if (i !== player) return p;
        const team = { ...p.team };
        const a = team[roleA];
        team[roleA] = team[roleB];
        team[roleB] = a;
        return { ...p, team, actionsUsed: { ...p.actionsUsed, skip: true } };
      })
    );
    closeAlterModal();
  }

  const [showHeader, setShowHeader] = useState(true);
  const scrollTimer = useRef(0);

  useEffect(() => {
    function onScroll() {
      setShowHeader(true);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
      scrollTimer.current = window.setTimeout(() => setShowHeader(false), 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header
            className={`flex items-center justify-between transition-all duration-200 ${
              showHeader
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <h1 className="text-3xl font-bold">⚔️ Battle Arena</h1>
            <div className="text-sm text-gray-300">
              Turn:{" "}
              <span className="font-semibold text-yellow-300">
                {turn === 0 ? players[0].name : players[1].name}
              </span>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left player */}
            <section
              className={`flex-1 bg-gray-900/40 rounded-2xl p-4 ${
                turn === 0 ? "ring-2 ring-yellow-400/40 animate-pulse" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">Player</div>
                  <div className="text-lg font-bold">{players[0].name}</div>
                </div>
                <div className="text-xs text-gray-400">Team</div>
              </div>

              {/* top row: captain, viceCaptain */}
              <div className="grid grid-cols-2 gap-3">
                {["captain", "viceCaptain"].map((r) => (
                  <Slot
                    key={r}
                    role={r}
                    card={players[0].team[r]}
                    onDrop={(role, card) => assignTo(0, role, card)}
                    disabled={turn !== 0}
                  />
                ))}
              </div>

              {/* bottom row: other 3 */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {["tank", "healer", "support"].map((r) => (
                  <Slot
                    key={r}
                    role={r}
                    card={players[0].team[r]}
                    onDrop={(role, card) => assignTo(0, role, card)}
                    disabled={turn !== 0}
                  />
                ))}
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-400 mb-2">Current Draw</div>
                {players[0].currentCard ? (
                  <Draggable card={players[0].currentCard} />
                ) : (
                  <div className="text-gray-500">No card drawn</div>
                )}
              </div>

              <div className="mt-3 flex gap-2 items-center">
                <button
                  disabled={players[0].actionsUsed.skip}
                  onClick={() => skipFor(0)}
                  className={`flex-1 px-3 py-2 rounded ${
                    players[0].actionsUsed.skip
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  Skip {players[0].actionsUsed.skip ? "• Used" : ""}
                </button>
                <button
                  disabled={players[0].actionsUsed.skip}
                  onClick={() => openAlterModal(0)}
                  className={`px-3 py-2 rounded ${
                    players[0].actionsUsed.skip
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Alter {players[0].actionsUsed.skip ? "• Used" : ""}
                </button>
              </div>
            </section>

            {/* Center - deck and shared actions */}
            <section className="w-64 flex-shrink-0 bg-gray-900/30 rounded-2xl p-4 flex flex-col items-center justify-start">
              <div className="text-sm text-gray-400 mb-3">Deck</div>
              <div className="w-40 h-56 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center border border-gray-600">
                <div className="text-center">
                  <div className="text-lg font-bold">{deck.length}</div>
                  <div className="text-xs text-gray-400">cards left</div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => drawFor(0)}
                    className={`px-4 py-2 rounded ${
                      turn === 0
                        ? "bg-yellow-500 ring-2 ring-yellow-400/40 animate-pulse"
                        : "bg-gray-700"
                    }`}
                  >
                    Draw (You)
                  </button>
                  <button
                    onClick={() => drawFor(1)}
                    className={`px-4 py-2 rounded ${
                      turn === 1
                        ? "bg-yellow-500 ring-2 ring-yellow-400/40 animate-pulse"
                        : "bg-gray-700"
                    }`}
                  >
                    Draw (Opponent)
                  </button>
                </div>
                <button
                  onClick={endTurn}
                  className="px-4 py-2 bg-gray-700 rounded"
                >
                  End Turn
                </button>
              </div>
            </section>

            {/* Right player */}
            <section
              className={`flex-1 bg-gray-900/40 rounded-2xl p-4 ${
                turn === 1 ? "ring-2 ring-yellow-400/40 animate-pulse" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400">Opponent</div>
                  <div className="text-lg font-bold">{players[1].name}</div>
                </div>
                <div className="text-xs text-gray-400">Team</div>
              </div>

              {/* top row: captain, viceCaptain */}
              <div className="grid grid-cols-2 gap-3">
                {["captain", "viceCaptain"].map((r) => (
                  <Slot
                    key={r}
                    role={r}
                    card={players[1].team[r]}
                    onDrop={(role, card) => assignTo(1, role, card)}
                    disabled={turn !== 1}
                  />
                ))}
              </div>

              {/* bottom row: other 3 */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                {["tank", "healer", "support"].map((r) => (
                  <Slot
                    key={r}
                    role={r}
                    card={players[1].team[r]}
                    onDrop={(role, card) => assignTo(1, role, card)}
                    disabled={turn !== 1}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <div className="text-sm text-gray-400 mb-2">Current Draw</div>
                {players[1].currentCard ? (
                  <Draggable card={players[1].currentCard} />
                ) : (
                  <div className="text-gray-500">No card drawn</div>
                )}
              </div>

              <div className="mt-3 flex gap-2 items-center">
                <button
                  disabled={players[1].actionsUsed.skip}
                  onClick={() => skipFor(1)}
                  className={`flex-1 px-3 py-2 rounded ${
                    players[1].actionsUsed.skip
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  Skip {players[1].actionsUsed.skip ? "• Used" : ""}
                </button>
                <button
                  disabled={players[1].actionsUsed.skip}
                  onClick={() => openAlterModal(1)}
                  className={`px-3 py-2 rounded ${
                    players[1].actionsUsed.skip
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                >
                  Alter {players[1].actionsUsed.skip ? "• Used" : ""}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* Alter modal */}
      {alterModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96 border border-gray-700">
            <h3 className="text-lg font-bold mb-3">Alter: Swap two roles</h3>
            <p className="text-sm text-gray-400 mb-4">
              Select two assigned roles to swap. This consumes your Skip token.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <select
                value={alterModal.roleA}
                onChange={(e) =>
                  setAlterModal((m) => ({ ...m, roleA: e.target.value }))
                }
                className="p-2 bg-gray-800 rounded"
              >
                <option value="">Select role A</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <select
                value={alterModal.roleB}
                onChange={(e) =>
                  setAlterModal((m) => ({ ...m, roleB: e.target.value }))
                }
                className="p-2 bg-gray-800 rounded"
              >
                <option value="">Select role B</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeAlterModal}
                className="px-3 py-2 bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAlter}
                className="px-3 py-2 bg-yellow-600 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DndProvider>
  );
}
