import { executeSQL } from '../db.ts';

export async function getGames() {
  return await executeSQL(`SELECT * FROM GAME`);
}
