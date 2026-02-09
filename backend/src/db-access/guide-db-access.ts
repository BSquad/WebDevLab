import { Db } from '../db.js';
import type { Guide } from '../../../shared/models/guide.ts';

export class GuideDbAccess {
    private db: Db = new Db();

    addGuide = async (guide: Guide) => {
        await this.db.executeSQL(
            `INSERT INTO GUIDES (userId, GAMEID, TITLE, CONTENT, CREATEDAT) VALUES (?, ?, ?, ?, datetime('now'))`,
            [guide.userId, guide.gameId, guide.title, guide.content],
        );
    };

    getGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
        const sql = `
          SELECT 
            g.id,
            g.userId,
            u.name AS author,
            g.gameId,
            g.title,
            g.content,
            g.pdfPath,
            g.createdAt
          FROM guides g
          JOIN users u ON g.userId = u.id
          WHERE g.gameId = ?
          ORDER BY g.createdAt DESC
        `;

        return (await this.db.executeSQL(sql, [gameId])) as Guide[];
    };

    getGuidesByUserId = async (userId: number): Promise<Guide[]> => {
        return await this.db.executeSQL(
            `
      SELECT g.id, g.title, gm.title as gameTitle, g.createdAt,
             (SELECT AVG(score) FROM guide_rating WHERE guideId = g.id) as averageRating
      FROM guides g
      JOIN games gm ON g.gameId = gm.id
      WHERE g.userId = ?`,
            [userId],
        );
    };
}
