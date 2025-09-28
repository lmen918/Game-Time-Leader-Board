import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import { ApiResponse, Game } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Game[]>>> {
  try {
    const games = await DatabaseManager.getGames();
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Game>>> {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Game name is required" },
        { status: 400 },
      );
    }

    // Check if game with same name already exists
    const existingGames = await DatabaseManager.getGames();
    const duplicateGame = existingGames.find(
      (g) => g.name.toLowerCase() === name.trim().toLowerCase(),
    );

    if (duplicateGame) {
      return NextResponse.json(
        { success: false, error: "Game with this name already exists" },
        { status: 409 },
      );
    }

    const game = await DatabaseManager.addGame(name.trim());
    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (error) {
    console.error("Error adding game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add game" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("id");

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: "Game ID is required" },
        { status: 400 },
      );
    }

    await DatabaseManager.removeGame(gameId);
    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error removing game:", error);

    if (error instanceof Error && error.message === "Game not found") {
      return NextResponse.json(
        { success: false, error: "Game not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to remove game" },
      { status: 500 },
    );
  }
}
