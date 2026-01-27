import { Db } from '../db.ts';
import type { Game } from '../../../shared/models/game.ts';

export class GameDbAccess {
  private db: Db = new Db();

  getGames = async (): Promise<Game[]> => {
    const games = await this.db.executeSQL(`SELECT * FROM GAMES`) as any[];
    return games.map(game => ({
      ...game,
      tags: this.splitStringToArray(game.tags),
      platform: this.splitStringToArray(game.platform),
    })) as Game[];
  }

  getGameById = async (gameId: number): Promise<Game> => {
    const game = await this.db.executeSQL(`SELECT * FROM GAMES WHERE id = ?`, [gameId], true);
    return {
      ...game,
      tags: this.splitStringToArray(game.tags),
      platform: this.splitStringToArray(game.platform),
    } as Game;
  }

  splitStringToArray = (text: string): string[] => {
    if (!text) return [];
    return text.split(',').map(v => v.trim()).filter(Boolean);
  }
}
