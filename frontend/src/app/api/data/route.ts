import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import { ApiResponse, DatabaseSchema } from "@/lib/types";

// Get all data at once (useful for initial app load or data export)
export async function GET(): Promise<
  NextResponse<ApiResponse<DatabaseSchema>>
> {
  try {
    const allData = await DatabaseManager.getAllData();
    return NextResponse.json({ success: true, data: allData });
  } catch (error) {
    console.error("Error fetching all data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

// Import/restore data (useful for data migration or backup restore)
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<DatabaseSchema>>> {
  try {
    const importData = await request.json();

    // Basic validation of the imported data structure
    if (!importData || typeof importData !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data format" },
        { status: 400 },
      );
    }

    const requiredFields = ["players", "games", "scores", "activities"];
    for (const field of requiredFields) {
      if (!Array.isArray(importData[field])) {
        return NextResponse.json(
          { success: false, error: `Missing or invalid ${field} array` },
          { status: 400 },
        );
      }
    }

    // Validate players structure
    for (const player of importData.players) {
      if (!player.id || !player.name || !player.createdAt) {
        return NextResponse.json(
          { success: false, error: "Invalid player structure" },
          { status: 400 },
        );
      }
    }

    // Validate games structure
    for (const game of importData.games) {
      if (!game.id || !game.name || !game.createdAt) {
        return NextResponse.json(
          { success: false, error: "Invalid game structure" },
          { status: 400 },
        );
      }
    }

    // Validate scores structure
    for (const score of importData.scores) {
      if (
        !score.id ||
        !score.playerId ||
        !score.gameId ||
        typeof score.score !== "number" ||
        !score.updatedAt
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid score structure" },
          { status: 400 },
        );
      }
    }

    // Validate activities structure
    for (const activity of importData.activities) {
      if (
        !activity.id ||
        !activity.type ||
        !activity.message ||
        !activity.timestamp
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid activity structure" },
          { status: 400 },
        );
      }
    }

    // TODO: Implement actual data import/replace functionality
    // For now, we'll just return success but you'd want to replace the entire database
    // This would require adding a method to DatabaseManager like:
    // await DatabaseManager.replaceAllData(importData);

    return NextResponse.json(
      {
        success: false,
        error:
          "Data import not yet implemented. Add replaceAllData method to DatabaseManager.",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error importing data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import data" },
      { status: 500 },
    );
  }
}

// Reset database to initial state
export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // TODO: Implement database reset functionality
    // This would require adding a method to DatabaseManager like:
    // await DatabaseManager.resetToInitialState();

    return NextResponse.json(
      {
        success: false,
        error:
          "Database reset not yet implemented. Add resetToInitialState method to DatabaseManager.",
      },
      { status: 501 },
    );
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset database" },
      { status: 500 },
    );
  }
}
