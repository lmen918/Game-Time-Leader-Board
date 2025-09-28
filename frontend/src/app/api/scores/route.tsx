import { NextRequest, NextResponse } from "next/server";
import { DatabaseManager } from "@/lib/database";
import { ApiResponse, Score } from "@/lib/types";

export async function GET(): Promise<NextResponse<ApiResponse<Score[]>>> {
  try {
    const scores = await DatabaseManager.getScores();
    return NextResponse.json({ success: true, data: scores });
  } catch (error) {
    console.error("Error fetching scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch scores" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Score>>> {
  try {
    const { playerId, gameId, score } = await request.json();

    // Validation
    if (!playerId || typeof playerId !== "string") {
      return NextResponse.json(
        { success: false, error: "Player ID is required and must be a string" },
        { status: 400 },
      );
    }

    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json(
        { success: false, error: "Game ID is required and must be a string" },
        { status: 400 },
      );
    }

    if (typeof score !== "number" || isNaN(score)) {
      return NextResponse.json(
        { success: false, error: "Score must be a valid number" },
        { status: 400 },
      );
    }

    if (score < 0) {
      return NextResponse.json(
        { success: false, error: "Score cannot be negative" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(score)) {
      return NextResponse.json(
        { success: false, error: "Score must be an integer" },
        { status: 400 },
      );
    }

    const updatedScore = await DatabaseManager.updateScore(
      playerId,
      gameId,
      score,
    );
    return NextResponse.json({ success: true, data: updatedScore });
  } catch (error) {
    console.error("Error updating score:", error);

    if (
      error instanceof Error &&
      error.message === "Player or game not found"
    ) {
      return NextResponse.json(
        { success: false, error: "Player or game not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update score" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<Score>>> {
  try {
    const { playerId, gameId, score } = await request.json();

    // Validation (same as PUT)
    if (!playerId || typeof playerId !== "string") {
      return NextResponse.json(
        { success: false, error: "Player ID is required and must be a string" },
        { status: 400 },
      );
    }

    if (!gameId || typeof gameId !== "string") {
      return NextResponse.json(
        { success: false, error: "Game ID is required and must be a string" },
        { status: 400 },
      );
    }

    if (typeof score !== "number" || isNaN(score)) {
      return NextResponse.json(
        { success: false, error: "Score must be a valid number" },
        { status: 400 },
      );
    }

    if (score < 0) {
      return NextResponse.json(
        { success: false, error: "Score cannot be negative" },
        { status: 400 },
      );
    }

    // Check if score already exists
    const existingScores = await DatabaseManager.getScores();
    const existingScore = existingScores.find(
      (s) => s.playerId === playerId && s.gameId === gameId,
    );

    if (existingScore) {
      return NextResponse.json(
        { success: false, error: "Score already exists. Use PUT to update." },
        { status: 409 },
      );
    }

    const newScore = await DatabaseManager.updateScore(playerId, gameId, score);
    return NextResponse.json(
      { success: true, data: newScore },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating score:", error);

    if (
      error instanceof Error &&
      error.message === "Player or game not found"
    ) {
      return NextResponse.json(
        { success: false, error: "Player or game not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create score" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");
    const gameId = searchParams.get("gameId");

    if (!playerId || !gameId) {
      return NextResponse.json(
        { success: false, error: "Both playerId and gameId are required" },
        { status: 400 },
      );
    }

    // Get current scores
    const scores = await DatabaseManager.getScores();
    const scoreIndex = scores.findIndex(
      (s) => s.playerId === playerId && s.gameId === gameId,
    );

    if (scoreIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Score not found" },
        { status: 404 },
      );
    }

    // Remove the score by updating with 0 (or you could implement a proper delete method)
    await DatabaseManager.updateScore(playerId, gameId, 0);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("Error deleting score:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete score" },
      { status: 500 },
    );
  }
}
