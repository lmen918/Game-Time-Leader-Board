import { NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";

interface HealthCheck {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  database: {
    status: "connected" | "error";
    players: number;
    games: number;
    scores: number;
    activities: number;
  };
  uptime: number;
  environment: string;
}

const startTime = Date.now();

export async function GET(): Promise<NextResponse<HealthCheck>> {
  const timestamp = new Date().toISOString();
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  try {
    // Test database connectivity by trying to read data
    const [players, games, scores, activities] = await Promise.all([
      DatabaseManager.getPlayers(),
      DatabaseManager.getGames(),
      DatabaseManager.getScores(),
      DatabaseManager.getActivities(),
    ]);

    const healthCheck: HealthCheck = {
      status: "healthy",
      timestamp,
      version: "1.0.0",
      database: {
        status: "connected",
        players: players.length,
        games: games.length,
        scores: scores.length,
        activities: activities.length,
      },
      uptime,
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json(healthCheck, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Health check failed:", error);

    const healthCheck: HealthCheck = {
      status: "unhealthy",
      timestamp,
      version: "1.0.0",
      database: {
        status: "error",
        players: 0,
        games: 0,
        scores: 0,
        activities: 0,
      },
      uptime,
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json(healthCheck, {
      status: 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}

// HEAD request for simple health check (returns just status code)
export async function HEAD(): Promise<NextResponse> {
  try {
    await DatabaseManager.getPlayers();
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Simple health check failed:", error);
    return new NextResponse(null, {
      status: 503,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}
