import type { Game } from "../../../shared/models/game.ts";
import { getGames } from "../db-access/game-db-access.ts";

export async function getAllGames() : Promise<Game[]> {
  return await getGames();
}