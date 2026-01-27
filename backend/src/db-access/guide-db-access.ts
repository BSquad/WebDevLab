import { Db } from '../db.js';
import type { Guide } from '../../../shared/models/guide.ts';

export class GuideDbAccess {
  private db: Db = new Db();

  addGuide = async (guide: Guide) => {
    await this.db.executeSQL(
      `INSERT INTO GUIDES (AUTHORID, GAMEID, TITLE, CONTENT, CREATEDAT) VALUES (?, ?, ?, ?, datetime('now'))`,
      [guide.authorId, guide.gameId, guide.title, guide.content]
    );
  }

  getGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
    const sql = `
      SELECT 
        g.id,
        g.authorId,
        u.name AS author,
        g.gameId,
        g.title,
        g.content,
        g.pdfPath,
        g.createdAt
      FROM guides g
      JOIN users u ON g.authorId = u.id
      WHERE g.gameId = ?
      ORDER BY g.createdAt DESC
    `;

    return await this.db.executeSQL(sql, [gameId]) as Guide[];
  }
}
