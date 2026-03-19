import { CommentsDbAccess } from '../db-access/comments-db-access.js';

export class CommentsService {
    private commentsDbAccess = new CommentsDbAccess();

    addComment = async (
        userId: number,
        guideId: number,
        text: string,
    ): Promise<void> => {
        await this.commentsDbAccess.addComment(userId, guideId, text);
    };

    getComments = async (guideId: number) => {
        return this.commentsDbAccess.getCommentsByGuideId(guideId);
    };
}
