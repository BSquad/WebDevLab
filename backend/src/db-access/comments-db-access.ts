import { Db } from '../db.js';

export class CommentsDbAccess {
    private db: Db = new Db();

    addComment = async (userId: number, guideId: number, text: string) => {
        const sql = `
      INSERT INTO guide_comments (userId, guideId, commentText)
      VALUES (?, ?, ?)
    `;
        await this.db.executeSQL(sql, [userId, guideId, text]);
    };

    getCommentsByGuideId = async (guideId: number) => {
        const sql = `
      SELECT gc.id,
             gc.userId,
             u.name AS author,
             gc.guideId,
             gc.commentText,
             gc.createdAt
      FROM guide_comments gc
      JOIN users u ON gc.userId = u.id
      WHERE gc.guideId = ?
      ORDER BY gc.createdAt DESC
    `;
        return await this.db.executeSQL(sql, [guideId]);
    };
}
