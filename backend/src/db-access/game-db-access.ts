import { Db } from '../db.ts';
import type { Game } from '../../../shared/models/game.ts';
import type { Achievement } from '../../../shared/models/achievement.ts';

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

  getAchievementsByGameId = async (gameId: number): Promise<Achievement[]> => {
    return await this.db.executeSQL(`SELECT * FROM ACHIEVEMENTS WHERE gameId = ?`, [gameId]) as Achievement[];
  }

  getAchievementsByGameIdForUser = async (gameId: number, userId: number): Promise<Achievement[]> => {
    return await this.db.executeSQL(`
      SELECT a.*, CASE WHEN ua.userId IS NOT NULL THEN 1 ELSE 0 END AS isCompleted
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievementId AND ua.userId = ?
      WHERE a.gameId = ?
    `, [userId, gameId]) as Achievement[];
  }

  competeAchievement = async (achievementId: number, userId: number) => {
    await this.db.executeSQL(
      `INSERT INTO USER_ACHIEVEMENTS (userId, achievementId, completedAt) VALUES (?, ?, datetime('now'))`,
      [userId, achievementId]
    );
  }

  splitStringToArray = (text: string): string[] => {
    if (!text) return [];
    return text.split(',').map(v => v.trim()).filter(Boolean);
  }
}
