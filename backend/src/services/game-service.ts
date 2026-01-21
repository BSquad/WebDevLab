import { getGames } from "../db-access/game-db-access.ts";

export async function getAllGames(){
  return await getGames();
}