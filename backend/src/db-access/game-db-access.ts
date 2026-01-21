import { executeSQL } from '../db.ts';
import type { Game } from '../../../shared/models/game.ts';

export async function getGames() : Promise<Game[]> {
  return await executeSQL(`SELECT * FROM GAMES`) as Promise<Game[]>;
}
