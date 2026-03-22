import type { Request, Response } from 'express';
import { CommentsService } from '../services/comments-service.js';
import createError from 'http-errors';

export class CommentsController {
    private commentsService = new CommentsService();

    private parseId(value: any, name: string): number {
        const id = Number(value);
        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }
        return id;
    }

    addComment = async (req: Request, res: Response): Promise<void> => {
        const userId = this.parseId(req.body.userId, 'userId');
        const guideId = this.parseId(req.body.guideId, 'guideId');
        const { commentText } = req.body;

        if (commentText.trim().length === 0) {
            throw createError(400, 'Comment text must not be empty');
        }

        await this.commentsService.addComment(
            userId,
            guideId,
            commentText.trim(),
        );

        res.status(201).json({ message: 'Comment added successfully' });
    };

    getComments = async (req: Request, res: Response): Promise<void> => {
        const guideId = this.parseId(req.params.guideId, 'guideId');

        const comments = await this.commentsService.getComments(guideId);

        res.status(200).json(comments);
    };
}
