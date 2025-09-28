import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import type { ApiResponse, Activity } from "@/lib/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Activity[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: "Limit must be between 1 and 100" },
        { status: 400 },
      );
    }

    const activities = await DatabaseManager.getActivities();
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json({ success: true, data: limitedActivities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch activities" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Activity>>> {
  try {
    const { type, message, playerId, gameId } = await request.json();

    // Validation
    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { success: false, error: "Activity type is required" },
        { status: 400 },
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, error: "Activity message is required" },
        { status: 400 },
      );
    }

    // Validate activity type
    const validTypes = [
      "player_added",
      "game_added",
      "score_updated",
      "player_removed",
      "game_removed",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid activity type. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // This is a manual activity creation - you might want to restrict this
    // or only allow it for certain admin users
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      type: type as Activity["type"],
      message,
      timestamp: new Date().toISOString(),
      playerId: playerId || undefined,
      gameId: gameId || undefined,
    };

    // For now, we'll just return the activity since our DatabaseManager
    // doesn't have a direct "addActivity" method (activities are created
    // automatically when other operations happen)
    return NextResponse.json(
      { success: true, data: newActivity },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create activity" },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // This endpoint could be used to clear old activities
    // For now, we'll return a method not allowed since activities
    // are automatically managed by the system
    return NextResponse.json(
      { success: false, error: "Activities cannot be manually deleted" },
      { status: 405 },
    );
  } catch (error) {
    console.error("Error deleting activities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete activities" },
      { status: 500 },
    );
  }
}
