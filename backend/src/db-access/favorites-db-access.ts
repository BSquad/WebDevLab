import { Db } from '../db.js';

export class FavoritesDbAccess {
    private db: Db = new Db();

    getFavoritesByUserId = async (userId: number) => {
        const sql = `
      SELECT g.*
      FROM user_games ug
      JOIN games g ON ug.gameId = g.id
      WHERE ug.userId = ? AND ug.isFavorite = 1
      ORDER BY ug.addedAt DESC
    `;
        return await this.db.executeSQL(sql, [userId]);
    };

    addFavorite = async (userId: number, gameId: number) => {
        const sql = `
      INSERT INTO user_games (userId, gameId, isFavorite)
      VALUES (?, ?, 1)
      ON CONFLICT(userId, gameId)
      DO UPDATE SET isFavorite = 1
    `;
        await this.db.executeSQL(sql, [userId, gameId]);
    };

    removeFavorite = async (userId: number, gameId: number) => {
        const sql = `
      DELETE FROM user_games
      WHERE userId = ? AND gameId = ?
    `;
        await this.db.executeSQL(sql, [userId, gameId]);
    };
}
