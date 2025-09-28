import fs from "fs/promises";
import path from "path";
import { DatabaseSchema, Player, Game, Score, Activity } from "./types";

const DB_FILE_PATH = path.join(process.cwd(), "src/data/database.json");

// Initialize empty database structure
const initialDatabase: DatabaseSchema = {
  players: [
    { id: "1", name: "Player 1", createdAt: new Date().toISOString() },
    { id: "2", name: "Player 2", createdAt: new Date().toISOString() },
    { id: "3", name: "Player 3", createdAt: new Date().toISOString() },
  ],
  games: [
    { id: "1", name: "Game 1", createdAt: new Date().toISOString() },
    { id: "2", name: "Game 2", createdAt: new Date().toISOString() },
    { id: "3", name: "Game 3", createdAt: new Date().toISOString() },
  ],
  scores: [
    {
      id: "1",
      playerId: "1",
      gameId: "1",
      score: 120,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      playerId: "1",
      gameId: "2",
      score: 85,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      playerId: "1",
      gameId: "3",
      score: 210,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      playerId: "2",
      gameId: "1",
      score: 95,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      playerId: "2",
      gameId: "2",
      score: 150,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "6",
      playerId: "2",
      gameId: "3",
      score: 180,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "7",
      playerId: "3",
      gameId: "1",
      score: 200,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "8",
      playerId: "3",
      gameId: "2",
      score: 75,
      updatedAt: new Date().toISOString(),
    },
    {
      id: "9",
      playerId: "3",
      gameId: "3",
      score: 95,
      updatedAt: new Date().toISOString(),
    },
  ],
  activities: [
    {
      id: "1",
      type: "score_updated",
      message: "Player 2 scored 150 in Game 2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      playerId: "2",
      gameId: "2",
    },
    {
      id: "2",
      type: "score_updated",
      message: "Player 1 scored 210 in Game 3",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      playerId: "1",
      gameId: "3",
    },
    {
      id: "3",
      type: "player_added",
      message: "Player 3 added to the leaderboard",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      playerId: "3",
    },
  ],
};

export class DatabaseManager {
  private static async ensureDatabaseExists(): Promise<void> {
    try {
      await fs.access(DB_FILE_PATH);
    } catch (error) {
      // File doesn't exist, create it with initial data
      const dataDir = path.dirname(DB_FILE_PATH);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(
        DB_FILE_PATH,
        JSON.stringify(initialDatabase, null, 2),
      );
    }
  }

  private static async readDatabase(): Promise<DatabaseSchema> {
    await this.ensureDatabaseExists();
    const data = await fs.readFile(DB_FILE_PATH, "utf-8");
    return JSON.parse(data);
  }

  private static async writeDatabase(data: DatabaseSchema): Promise<void> {
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));
  }

  // Player operations
  static async getPlayers(): Promise<Player[]> {
    const db = await this.readDatabase();
    return db.players;
  }

  static async addPlayer(name: string): Promise<Player> {
    const db = await this.readDatabase();
    const newPlayer: Player = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };

    db.players.push(newPlayer);

    // Add activity
    db.activities.unshift({
      id: Date.now().toString(),
      type: "player_added",
      message: `${name} added to the leaderboard`,
      timestamp: new Date().toISOString(),
      playerId: newPlayer.id,
    });

    await this.writeDatabase(db);
    return newPlayer;
  }

  static async removePlayer(playerId: string): Promise<void> {
    const db = await this.readDatabase();
    const player = db.players.find((p) => p.id === playerId);

    if (!player) throw new Error("Player not found");

    // Remove player
    db.players = db.players.filter((p) => p.id !== playerId);

    // Remove associated scores
    db.scores = db.scores.filter((s) => s.playerId !== playerId);

    // Add activity
    db.activities.unshift({
      id: Date.now().toString(),
      type: "player_removed",
      message: `${player.name} removed from the leaderboard`,
      timestamp: new Date().toISOString(),
    });

    await this.writeDatabase(db);
  }

  // Game operations
  static async getGames(): Promise<Game[]> {
    const db = await this.readDatabase();
    return db.games;
  }

  static async addGame(name: string): Promise<Game> {
    const db = await this.readDatabase();
    const newGame: Game = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };

    db.games.push(newGame);

    // Add activity
    db.activities.unshift({
      id: Date.now().toString(),
      type: "game_added",
      message: `${name} added to games`,
      timestamp: new Date().toISOString(),
      gameId: newGame.id,
    });

    await this.writeDatabase(db);
    return newGame;
  }

  static async removeGame(gameId: string): Promise<void> {
    const db = await this.readDatabase();
    const game = db.games.find((g) => g.id === gameId);

    if (!game) throw new Error("Game not found");

    // Remove game
    db.games = db.games.filter((g) => g.id !== gameId);

    // Remove associated scores
    db.scores = db.scores.filter((s) => s.gameId !== gameId);

    // Add activity
    db.activities.unshift({
      id: Date.now().toString(),
      type: "game_removed",
      message: `${game.name} removed from games`,
      timestamp: new Date().toISOString(),
    });

    await this.writeDatabase(db);
  }

  // Score operations
  static async getScores(): Promise<Score[]> {
    const db = await this.readDatabase();
    return db.scores;
  }

  static async updateScore(
    playerId: string,
    gameId: string,
    score: number,
  ): Promise<Score> {
    const db = await this.readDatabase();
    const player = db.players.find((p) => p.id === playerId);
    const game = db.games.find((g) => g.id === gameId);

    if (!player || !game) throw new Error("Player or game not found");

    const existingScore = db.scores.find(
      (s) => s.playerId === playerId && s.gameId === gameId,
    );

    if (existingScore) {
      existingScore.score = score;
      existingScore.updatedAt = new Date().toISOString();
    } else {
      const newScore: Score = {
        id: Date.now().toString(),
        playerId,
        gameId,
        score,
        updatedAt: new Date().toISOString(),
      };
      db.scores.push(newScore);
    }

    // Add activity
    db.activities.unshift({
      id: Date.now().toString(),
      type: "score_updated",
      message: `${player.name} scored ${score} in ${game.name}`,
      timestamp: new Date().toISOString(),
      playerId,
      gameId,
    });

    await this.writeDatabase(db);
    return existingScore || db.scores[db.scores.length - 1];
  }

  // Activity operations
  static async getActivities(): Promise<Activity[]> {
    const db = await this.readDatabase();
    return db.activities.slice(0, 10); // Return last 10 activities
  }

  // Get all data
  static async getAllData(): Promise<DatabaseSchema> {
    return await this.readDatabase();
  }
}
