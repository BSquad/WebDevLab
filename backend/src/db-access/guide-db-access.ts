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

    getGuideById = async (id: number): Promise<Guide | undefined> => {
        const sql = `
          SELECT 
            g.id,
            g.userId,
            u.name AS author,
            g.gameId,
            g.title,
            g.content,
            g.pdfPath,
            g.createdAt,
            g.updatedAt
          FROM guides g
          JOIN users u ON g.userId = u.id
          WHERE g.id = ?
        `;

        return (await this.db.executeSQL(sql, [id], true)) as Guide | undefined;
    };

    updateGuide = async (
        id: number,
        userId: number,
        guide: Guide,
    ): Promise<boolean> => {
        const result = await this.db.executeSQL(
            `
        UPDATE guides
        SET title = ?, content = ?, updatedAt = datetime('now')
        WHERE id = ? AND userId = ?
        `,
            [guide.title, guide.content, id, userId],
        );

        return result.changes > 0;
    };

    deleteGuide = async (id: number, userId: number): Promise<boolean> => {
        const result = await this.db.executeSQL(
            `
        DELETE FROM guides
        WHERE id = ? AND userId = ?
        `,
            [id, userId],
        );

        return result.changes > 0;
    };

    rateGuide = async (
        guideId: number,
        userId: number,
        score: number,
    ): Promise<void> => {
        await this.db.executeSQL(
            `
        INSERT INTO guide_rating (guideId, userId, score)
        VALUES (?, ?, ?)
        ON CONFLICT(userId, guideId)
        DO UPDATE SET score = excluded.score
        `,
            [guideId, userId, score],
        );
    };

    getTopGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
        const sql = `
        SELECT 
            g.id,
            g.userId,
            u.name AS author,
            g.gameId,
            g.title,
            g.content,
            g.pdfPath,
            g.createdAt,
            COALESCE(AVG(r.score), 0) AS avgRating,
            COUNT(r.id) AS ratingCount
        FROM guides g
        JOIN users u ON g.userId = u.id
        LEFT JOIN guide_rating r ON g.id = r.guideId
        WHERE g.gameId = ?
        GROUP BY g.id
        ORDER BY avgRating DESC, g.createdAt DESC
        LIMIT 3
    `;

        return (await this.db.executeSQL(sql, [gameId])) as Guide[];
    };

    addScreenshot = async (guideId: number, filePath: string) => {
        await this.db.executeSQL(
            `
        INSERT INTO screenshots (guideId, filePath)
        VALUES (?, ?)
        `,
            [guideId, filePath],
        );
    };
}
