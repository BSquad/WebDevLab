import type { Request, Response } from 'express';
import { GuideService } from '../services/guide-service.js';
import type { Guide } from '../../../shared/models/guide.ts';
import createError from 'http-errors';

export class GuideController {
    private guideService = new GuideService();

    private checkId(value: any, name: string): number {
        if (value == null || value === '') {
            throw createError(400, `Missing ${name}`);
        }

        const id = Number(value);

        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }

        return id;
    }

    createGuide = async (req: Request, res: Response): Promise<void> => {
        const guide = req.body as Guide;

        const gameId = this.checkId(guide.gameId, 'gameId');
        const userId = this.checkId(guide.userId, 'userId');

        if (!guide.title || !guide.content) {
            throw createError(400, 'Missing title or content');
        }

        try {
            const id = await this.guideService.createGuide(guide);
            res.status(201).json({ id });
        } catch (err: any) {
            if (err.message === 'DUPLICATE_GUIDE') {
                throw createError(
                    409,
                    'Guide with this title already exists for this game',
                );
            }
            throw err;
        }
    };

    getGuidesByGameId = async (req: Request, res: Response): Promise<void> => {
        const gameId = this.checkId(req.params.gameId, 'gameId');

        const guides = await this.guideService.getGuidesByGameId(gameId);
        res.status(200).json(guides);
    };

    getGuideById = async (req: Request, res: Response): Promise<void> => {
        const id = this.checkId(req.params.id, 'guideId');

        const guide = await this.guideService.getGuideById(id);

        if (!guide) {
            throw createError(404, 'Guide not found');
        }

        res.status(200).json(guide);
    };

    getGuidesByUserId = async (req: Request, res: Response): Promise<void> => {
        const userId = this.checkId(req.params.userId, 'userId');

        const guides = await this.guideService.getGuidesByUserId(userId);
        res.status(200).json(guides);
    };

    getTopGuidesByGameId = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const gameId = this.checkId(req.params.gameId, 'gameId');

        const guides = await this.guideService.getTopGuidesByGameId(gameId);
        res.status(200).json(guides);
    };

    updateGuide = async (req: Request, res: Response): Promise<void> => {
        const id = this.checkId(req.params.id, 'guideId');
        const userId = this.checkId(Number(req.body.userId), 'userId');
        const { title, content } = req.body;

        try {
            await this.guideService.updateGuide(id, userId, {
                title,
                content,
            } as Guide);
            res.status(200).json({ message: 'Guide updated successfully' });
        } catch (err: any) {
            if (err.message === 'NOT_FOUND_OR_NO_PERMISSION') {
                throw createError(
                    403,
                    'Guide not found or you do not have permission to edit it',
                );
            }
            throw err;
        }
    };

    deleteGuide = async (req: Request, res: Response): Promise<void> => {
        const id = this.checkId(req.params.id, 'guideId');
        const userId = Number(req.body.userId);

        if (Number.isNaN(userId)) {
            throw createError(400, 'userId required');
        }

        try {
            await this.guideService.deleteGuide(id, userId);
            res.status(200).json({ message: 'Guide deleted successfully' });
        } catch (err: any) {
            if (err.message === 'NOT_FOUND_OR_NO_PERMISSION') {
                throw createError(
                    403,
                    'Guide not found or you do not have permission to delete it',
                );
            }
            throw err;
        }
    };

    rateGuide = async (req: Request, res: Response): Promise<void> => {
        const guideId = this.checkId(req.params.id, 'guideId');
        const userId = Number(req.body.userId);
        const rating = Number(req.body.rating);

        if (Number.isNaN(userId)) {
            throw createError(400, 'userId required');
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw createError(400, 'Rating must be between 1 and 5');
        }

        await this.guideService.rateGuide(guideId, userId, rating);

        res.status(200).json({ message: 'Rating submitted' });
    };

    uploadScreenshot = async (req: Request, res: Response): Promise<void> => {
        const guideId = this.checkId(req.params.id, 'guideId');

        if (!req.file) throw createError(400, 'No file uploaded');

        const filePath = `/uploads/images/guides/${req.file.filename}`;

        await this.guideService.addScreenshot(guideId, filePath);

        res.status(200).json({ path: filePath });
    };

    deleteScreenshot = async (req: Request, res: Response): Promise<void> => {
        const guideId = this.checkId(req.params.id, 'guideId');
        const { filePath } = req.body;

        if (!filePath) throw createError(400, 'filePath required');

        await this.guideService.deleteScreenshot(guideId, filePath);

        res.status(200).json({ message: 'Screenshot deleted' });
    };

    downloadGuidePdf = async (req: Request, res: Response): Promise<void> => {
        const id = this.checkId(req.params.id, 'guideId');

        try {
            const guide = await this.guideService.getGuideById(id);

            if (!guide) {
                throw createError(404, 'Guide not found');
            }

            const pdfBuffer = await this.guideService.generateGuidePdf(id);

            const fileName = `${guide.title}`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${fileName}.pdf"`,
            );

            res.send(pdfBuffer);
        } catch (err: any) {
            if (err.message === 'GUIDE_NOT_FOUND') {
                throw createError(404, 'Guide not found');
            }
            throw err;
        }
    };
}
