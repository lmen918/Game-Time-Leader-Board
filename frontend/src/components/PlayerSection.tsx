"use client";

import { useState } from "react";
import { Users, Trash2, Plus } from "lucide-react";
import { PlayerSectionProps } from "@/lib/types";

export default function PlayerSection({
  players,
  isEditMode,
  onAddPlayer,
  onRemovePlayer,
}: PlayerSectionProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onAddPlayer(newPlayerName.trim());
      setNewPlayerName("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-black/50 border-b border-yellow-500/20 p-4">
        <h2 className="text-xl font-semibold text-game-primary flex items-center">
          <Users className="mr-2" size={20} />
          Players
        </h2>
      </div>
      <div className="p-4">
        {isEditMode && (
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new player..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-game-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !newPlayerName.trim()}
                className="bg-game-primary hover:bg-game-secondary text-black px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </form>
        )}
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="flex justify-between items-center bg-gray-800/50 hover:bg-gray-800 rounded-lg px-4 py-3 transition-colors"
            >
              <span className="font-medium">{player.name}</span>
              {isEditMode && (
                <button
                  onClick={() => onRemovePlayer(player.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
