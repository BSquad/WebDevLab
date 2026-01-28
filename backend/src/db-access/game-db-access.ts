import { Db } from '../db.js';
import type { Game } from '../../../shared/models/game.ts';
import type { Achievement } from '../../../shared/models/achievement.ts';
import { User } from '../../../shared/models/user.js';

export class GameDbAccess {
  private db: Db = new Db();

  getGames = async (userId?: number): Promise<Game[]> => {
    const games = await this.db.executeSQL(`
        SELECT 
          g.*,
          CASE WHEN ug.userId IS NOT NULL THEN 1 ELSE 0 END AS isTracked,
          COALESCE(ug.isFavorite, 0) AS isFavourite,
          (SELECT COUNT(*) FROM achievements a WHERE a.gameId = g.id) AS achievementCount
        FROM games g
        LEFT JOIN user_games ug
          ON g.id = ug.gameId AND ug.userId = ?
      `, [userId ?? -1]) as any[];

    return games.map(game => ({
      ...game,
      tags: this.splitStringToArray(game.tags),
      platform: this.splitStringToArray(game.platform),
      isTracked: Boolean(game.isTracked),
      isFavourite: Boolean(game.isFavourite),
    })) as Game[];
  }

  getGameById = async (gameId: number, userId?: number): Promise<Game> => {
    const game = await this.db.executeSQL(`
        SELECT 
          g.*,
          CASE WHEN ug.userId IS NOT NULL THEN 1 ELSE 0 END AS isTracked,
          COALESCE(ug.isFavorite, 0) AS isFavourite,
          (SELECT COUNT(*) FROM achievements a WHERE a.gameId = g.id) AS achievementCount
        FROM games g
        LEFT JOIN user_games ug
          ON g.id = ug.gameId AND ug.userId = ?
        WHERE g.id = ?
      `, [userId ?? -1, gameId], true);

    return {
      ...game,
      tags: this.splitStringToArray(game.tags),
      platform: this.splitStringToArray(game.platform),
      isTracked: Boolean(game.isTracked),
      isFavourite: Boolean(game.isFavourite),
    } as Game;
  }

  getAchievementsByGameId = async (gameId: number, userId?: number): Promise<Achievement[]> => {
    const achievements = await this.db.executeSQL(`
      SELECT 
        a.*, 
        CASE WHEN ua.userId IS NOT NULL THEN 1 ELSE 0 END AS isCompleted
      FROM achievements a
      LEFT JOIN user_achievements ua 
        ON a.id = ua.achievementId AND ua.userId = ?
      WHERE a.gameId = ?
    `, [userId ?? -1, gameId]) as Achievement[];

    return achievements.map(a => ({
      ...a,
      isCompleted: Boolean(a.isCompleted)
    }));
  }

  completeAchievement = async (achievementId: number, userId: number, gameId: number) => {
    await this.db.executeSQL(
      `INSERT INTO USER_ACHIEVEMENTS (userId, achievementId, gameId, completedAt) VALUES (?, ?, ?, datetime('now'))`,
      [userId, achievementId, gameId]
    );
  }

  trackGame = async (gameId: number, userId: number) => {
    await this.db.executeSQL(
      `INSERT OR IGNORE INTO USER_GAMES (userId, gameId, isFavorite) VALUES (?, ?, 0)`,
      [userId, gameId]
    );
  }

  unTrackGame = async (gameId: number, userId: number) => {
    await this.db.executeSQL(
      `DELETE FROM USER_GAMES WHERE userId = ? AND gameId = ?`,
      [userId, gameId]
    );
  }

  getBestUsersByGameId = async (gameId: number): Promise<User[]> => {
    return await this.db.executeSQL(`
      SELECT u.id, u.name, u.email, COUNT(ua.achievementId) AS achievementCount
      FROM user_achievements ua
      LEFT JOIN users u ON u.id = ua.userId
      WHERE ua.gameId = ?
      GROUP BY u.id, u.name, u.email
      ORDER BY achievementCount DESC
      LIMIT 10
    `, [gameId]) as User[];
  }

  splitStringToArray = (text: string): string[] => {
    if (!text) return [];
    return text.split(',').map(v => v.trim()).filter(Boolean);
  }
}
