import { CommentsDbAccess } from '../db-access/comments-db-access.js';

export class CommentsService {
    private commentsDbAccess = new CommentsDbAccess();

    addComment = async (userId: number, guideId: number, text: string) => {
        if (!text || text.trim().length === 0) {
            throw new Error('Comment text must not be empty');
        }

        await this.commentsDbAccess.addComment(userId, guideId, text);
    };

    getComments = async (guideId: number) => {
        return await this.commentsDbAccess.getCommentsByGuideId(guideId);
    };
}
