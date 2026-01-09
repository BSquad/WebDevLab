import { executeSQL } from './db.ts';

export async function getGames() {
  return executeSQL(`SELECT * FROM GAME`);
}
