import type { Request, Response } from 'express';
import { CommentsService } from '../services/comments-service.js';

export class CommentsController {
    private commentsService = new CommentsService();

    addComment = async (req: Request, res: Response) => {
        const { userId, guideId, commentText } = req.body;
        await this.commentsService.addComment(userId, guideId, commentText);
        res.json(true);
    };

    getComments = async (req: Request, res: Response) => {
        const guideId = Number(req.params.guideId);
        const comments = await this.commentsService.getComments(guideId);
        res.json(comments);
    };
}
