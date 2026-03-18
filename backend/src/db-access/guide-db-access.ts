import { Db } from '../db.js';
import type { Guide } from '../../../shared/models/guide.ts';
import fs from 'fs';
import path from 'path';

export class GuideDbAccess {
    private db: Db = new Db();

    addGuide = async (guide: Guide): Promise<number> => {
        const result = await this.db.executeSQL(
            `
        INSERT INTO guides (userId, gameId, title, content, createdAt)
        VALUES (?, ?, ?, ?, datetime('now'))
        `,
            [guide.userId, guide.gameId, guide.title, guide.content],
        );

        return result.lastID;
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
        g.createdAt,
        COALESCE(ROUND(AVG(r.score),1),0) AS avgRating
      FROM guides g
      JOIN users u ON g.userId = u.id
      LEFT JOIN guide_rating r ON g.id = r.guideId
      WHERE g.gameId = ?
      GROUP BY g.id
      ORDER BY g.createdAt DESC
    `;

        return (await this.db.executeSQL(sql, [gameId])) as Guide[];
    };

    getGuidesByUserId = async (userId: number): Promise<Guide[]> => {
        const sql = `
      SELECT 
        g.id,
        g.userId,
        u.name AS author,
        g.gameId,
        g.title,
        g.content,
        g.createdAt,
        g.updatedAt,
        COALESCE(ROUND(AVG(r.score),1),0) AS avgRating
      FROM guides g
      JOIN users u ON g.userId = u.id
      LEFT JOIN guide_rating r ON g.id = r.guideId
      WHERE g.userId = ?
      GROUP BY g.id
    `;

        return (await this.db.executeSQL(sql, [userId])) as Guide[];
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
        g.createdAt,
        g.updatedAt,
        COALESCE(ROUND(AVG(r.score),1),0) AS avgRating
      FROM guides g
      JOIN users u ON g.userId = u.id
      LEFT JOIN guide_rating r ON g.id = r.guideId
      WHERE g.id = ?
      GROUP BY g.id
    `;

        const guide = (await this.db.executeSQL(sql, [id], true)) as
            | Guide
            | undefined;

        if (!guide) {
            return undefined;
        }

        const screenshotRows = await this.db.executeSQL(
            `
        SELECT filePath
        FROM screenshots
        WHERE guideId = ?
        `,
            [id],
        );

        guide.screenshots = screenshotRows.map((row: any) => row.filePath);

        return guide;
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

    async getScreenshotsByGuideId(guideId: number) {
        const sql = `
        SELECT filePath
        FROM screenshots
        WHERE guideId = ?
        ORDER BY id ASC
    `;

        return await this.db.executeSQL(sql, [guideId]);
    }

    addScreenshot = async (guideId: number, filePath: string) => {
        await this.db.executeSQL(
            `
        INSERT INTO screenshots (guideId, filePath)
        VALUES (?, ?)
        `,
            [guideId, filePath],
        );
    };

    deleteScreenshot = async (guideId: number, filePath: string) => {
        await this.db.executeSQL(
            `
        DELETE FROM screenshots
        WHERE guideId = ? AND filePath = ?
        `,
            [guideId, filePath],
        );

        const fullPath = path.join('uploads', filePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    };
}
