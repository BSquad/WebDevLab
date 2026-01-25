import { Db } from '../db.ts';
import type { Game } from '../../../shared/models/game.ts';

export class GameDbAccess {
  private db: Db = new Db();

  getGames = async (): Promise<Game[]> => {
    return await this.db.executeSQL(`SELECT * FROM GAMES`) as Promise<Game[]>;
  }
}
