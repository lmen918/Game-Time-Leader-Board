"use client";

import { useState, useEffect, useMemo } from "react";
import { Award, Edit3 } from "lucide-react";
import { Player, Game, Score, Activity, LeaderboardRow } from "@/lib/types";
import PlayerSection from "@/components/PlayerSection";
import GameSection from "@/components/GameSection";
import LeaderboardTable from "@/components/LeaderboardTable";
import RecentActivity from "@/components/RecentActivity";
import VantaBackground from "@/components/VantaBackground";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersRes, gamesRes, scoresRes, activitiesRes] =
          await Promise.all([
            fetch("/api/players"),
            fetch("/api/games"),
            fetch("/api/scores"),
            fetch("/api/activities"),
          ]);

        const [playersData, gamesData, scoresData, activitiesData] =
          await Promise.all([
            playersRes.json(),
            gamesRes.json(),
            scoresRes.json(),
            activitiesRes.json(),
          ]);

        if (playersData.success) setPlayers(playersData.data);
        if (gamesData.success) setGames(gamesData.data);
        if (scoresData.success) setScores(scoresData.data);
        if (activitiesData.success) setActivities(activitiesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate leaderboard data
  const leaderboardData = useMemo((): LeaderboardRow[] => {
    return players
      .map((player) => {
        const playerScores: { [gameId: string]: number } = {};
        let total = 0;

        games.forEach((game) => {
          const score = scores.find(
            (s) => s.playerId === player.id && s.gameId === game.id,
          );
          const scoreValue = score?.score || 0;
          playerScores[game.id] = scoreValue;
          total += scoreValue;
        });

        return {
          player,
          scores: playerScores,
          total,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [players, games, scores]);

  // Player operations
  const handleAddPlayer = async (name: string) => {
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      if (result.success) {
        setPlayers((prev) => [...prev, result.data]);
        // Refresh activities
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) setActivities(activitiesData.data);
      }
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      const response = await fetch(`/api/players?id=${playerId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setPlayers((prev) => prev.filter((p) => p.id !== playerId));
        setScores((prev) => prev.filter((s) => s.playerId !== playerId));
        // Refresh activities
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) setActivities(activitiesData.data);
      }
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };

  // Game operations
  const handleAddGame = async (name: string) => {
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();
      if (result.success) {
        setGames((prev) => [...prev, result.data]);
        // Refresh activities
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) setActivities(activitiesData.data);
      }
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  const handleRemoveGame = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games?id=${gameId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        setGames((prev) => prev.filter((g) => g.id !== gameId));
        setScores((prev) => prev.filter((s) => s.gameId !== gameId));
        // Refresh activities
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) setActivities(activitiesData.data);
      }
    } catch (error) {
      console.error("Error removing game:", error);
    }
  };

  // Score operations
  const handleUpdateScore = async (
    playerId: string,
    gameId: string,
    score: number,
  ) => {
    try {
      const response = await fetch("/api/scores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, gameId, score }),
      });

      const result = await response.json();
      if (result.success) {
        // Update local state
        setScores((prev) => {
          const existing = prev.find(
            (s) => s.playerId === playerId && s.gameId === gameId,
          );
          if (existing) {
            return prev.map((s) =>
              s.playerId === playerId && s.gameId === gameId
                ? { ...s, score, updatedAt: new Date().toISOString() }
                : s,
            );
          } else {
            return [...prev, result.data];
          }
        });

        // Refresh activities
        const activitiesRes = await fetch("/api/activities");
        const activitiesData = await activitiesRes.json();
        if (activitiesData.success) setActivities(activitiesData.data);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-game-bg">
        <div className="text-game-primary text-xl font-orbitron">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-orbitron relative">
      <VantaBackground />

      {/* Header */}
      <header className="bg-black border-b border-yellow-500/30 py-4 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-game-primary glow-text flex items-center">
              <Award className="mr-2" size={32} />
              GAME-TIME LEADERBOARD
            </h1>
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${
                isEditMode
                  ? "bg-game-primary text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-game-primary"
              }`}
            >
              <Edit3 className="mr-2" size={16} />
              Edit Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Players Section */}
          <PlayerSection
            players={players}
            isEditMode={isEditMode}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
          />

          {/* Games Section */}
          <GameSection
            games={games}
            isEditMode={isEditMode}
            onAddGame={handleAddGame}
            onRemoveGame={handleRemoveGame}
          />

          {/* Leaderboard Section */}
          <div className="lg:col-span-3">
            <LeaderboardTable
              leaderboardData={leaderboardData}
              games={games}
              isEditMode={isEditMode}
              onUpdateScore={handleUpdateScore}
            />
          </div>

          {/* Recent Activity Section */}
          <div className="lg:col-span-3">
            <RecentActivity activities={activities} />
          </div>
        </div>
      </main>
    </div>
  );
}
