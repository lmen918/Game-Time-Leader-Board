"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { LeaderboardTableProps } from "@/lib/types";

export default function LeaderboardTable({
  leaderboardData,
  games,
  isEditMode,
  onUpdateScore,
}: LeaderboardTableProps) {
  const [editingScore, setEditingScore] = useState<string | null>(null);

  const handleScoreUpdate = async (
    playerId: string,
    gameId: string,
    newScore: string,
  ) => {
    const score = parseInt(newScore) || 0;
    await onUpdateScore(playerId, gameId, score);
    setEditingScore(null);
  };

  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-black/50 border-b border-yellow-500/20 p-4">
        <h2 className="text-xl font-semibold text-game-primary flex items-center">
          <BarChart3 className="mr-2" size={20} />
          Leaderboard
        </h2>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800 text-game-primary">
              <th className="pb-3 font-semibold">Rank</th>
              <th className="pb-3 font-semibold">Player</th>
              {games.map((game) => (
                <th key={game.id} className="pb-3 font-semibold">
                  {game.name}
                </th>
              ))}
              <th className="pb-3 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leaderboardData.map((row, index) => (
              <tr
                key={row.player.id}
                className="hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                          ? "bg-gray-400 text-black"
                          : index === 2
                            ? "bg-amber-600 text-black"
                            : "bg-gray-700 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 font-medium">{row.player.name}</td>
                {games.map((game) => (
                  <td key={game.id} className="py-3">
                    {isEditMode ? (
                      <input
                        type="number"
                        value={row.scores[game.id] || 0}
                        onChange={(e) =>
                          handleScoreUpdate(
                            row.player.id,
                            game.id,
                            e.target.value,
                          )
                        }
                        className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:border-game-primary"
                        min="0"
                      />
                    ) : (
                      <span className="text-white">
                        {row.scores[game.id] || 0}
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-3 font-bold text-game-primary text-lg">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
