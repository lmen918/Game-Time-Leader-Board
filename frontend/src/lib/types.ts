export interface Player {
  id: string;
  name: string;
  createdAt: string;
}

export interface Game {
  id: string;
  name: string;
  createdAt: string;
}

export interface Score {
  id: string;
  playerId: string;
  gameId: string;
  score: number;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type:
    | "player_added"
    | "game_added"
    | "score_updated"
    | "player_removed"
    | "game_removed";
  message: string;
  timestamp: string;
  playerId?: string;
  gameId?: string;
}

export interface LeaderboardRow {
  player: Player;
  scores: { [gameId: string]: number };
  total: number;
}

export interface DatabaseSchema {
  players: Player[];
  games: Game[];
  scores: Score[];
  activities: Activity[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Component Props Types
export interface PlayerSectionProps {
  players: Player[];
  isEditMode: boolean;
  onAddPlayer: (name: string) => Promise<void>;
  onRemovePlayer: (playerId: string) => Promise<void>;
}

export interface GameSectionProps {
  games: Game[];
  isEditMode: boolean;
  onAddGame: (name: string) => Promise<void>;
  onRemoveGame: (gameId: string) => Promise<void>;
}

export interface LeaderboardTableProps {
  leaderboardData: LeaderboardRow[];
  games: Game[];
  isEditMode: boolean;
  onUpdateScore: (
    playerId: string,
    gameId: string,
    score: number,
  ) => Promise<void>;
}

export interface RecentActivityProps {
  activities: Activity[];
}

export interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
}
