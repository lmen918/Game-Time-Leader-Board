import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import { ApiResponse, Player } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Player[]>>> {
  try {
    const players = await DatabaseManager.getPlayers();
    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch players" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Player>>> {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Player name is required" },
        { status: 400 },
      );
    }

    // Check if player with same name already exists
    const existingPlayers = await DatabaseManager.getPlayers();
    const duplicatePlayer = existingPlayers.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicatePlayer) {
      return NextResponse.json(
        { success: false, error: "Player with this name already exists" },
        { status: 409 },
      );
    }

    const player = await DatabaseManager.addPlayer(name.trim());
    return NextResponse.json({ success: true, data: player }, { status: 201 });
  } catch (error) {
    console.error("Error adding player:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add player" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("id");

    if (!playerId) {
      return NextResponse.json(
        { success: false, error: "Player ID is required" },
        { status: 400 },
      );
    }

    await DatabaseManager.removePlayer(playerId);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error removing player:", error);

    if (error instanceof Error && error.message === "Player not found") {
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to remove player" },
      { status: 500 },
    );
  }
}
