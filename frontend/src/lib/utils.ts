import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2);
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function calculatePlayerTotal(scores: {
  [gameId: string]: number;
}): number {
  return Object.values(scores).reduce((sum, score) => sum + score, 0);
}

export function sortLeaderboard<T extends { total: number }>(data: T[]): T[] {
  return [...data].sort((a, b) => b.total - a.total);
}

export async function fetchApi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
