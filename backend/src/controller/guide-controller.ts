import type { Request, Response } from 'express';
import { GuideService } from '../services/guide-service.js';
import type { Guide } from '../../../shared/models/guide.ts';

export class GuideController {
    private guideService: GuideService = new GuideService();

    createGuide = async (req: Request, res: Response) => {
        try {
            const guide = req.body as Guide;

            const id = await this.guideService.createGuide(guide);

            res.json(id);
        } catch (err: any) {
            if (err.message.includes('SQLITE_CONSTRAINT')) {
                return res.status(400).json({
                    message:
                        'You already created a guide with this title for this game.',
                });
            }

            res.status(500).json({ message: err.message });
        }
    };

    getGuidesByGameId = async (req: Request, res: Response) => {
        const gameId = Number(req.params.gameId);
        const guides = await this.guideService.getGuidesByGameId(gameId);
        res.json(guides);
    };

    getGuideById = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const guide = await this.guideService.getGuideById(id);

        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }

        res.json(guide);
    };

    getGuidesByUserId = async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);

        const guides = await this.guideService.getGuidesByUserId(userId);

        res.json(guides);
    };

    updateGuide = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { userId, title, content } = req.body;

        await this.guideService.updateGuide(id, Number(userId), {
            title,
            content,
        } as Guide);

        res.json(true);
    };

    deleteGuide = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { userId } = req.body;

        await this.guideService.deleteGuide(id, Number(userId));

        res.json(true);
    };

    rateGuide = async (req: Request, res: Response) => {
        const guideId = Number(req.params.id);
        const rating = Number(req.body.rating);
        const userId = Number(req.body.userId);

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }
        await this.guideService.rateGuide(guideId, userId, rating);

        res.json(true);
    };

    getTopGuidesByGameId = async (req: Request, res: Response) => {
        const gameId = Number(req.params.gameId);
        const guides = await this.guideService.getTopGuidesByGameId(gameId);
        res.json(guides);
    };

    uploadScreenshot = async (req: Request, res: Response) => {
        const guideId = Number(req.params.id);

        if (!guideId) {
            return res.status(400).json({ message: 'Invalid guide id' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = `/uploads/images/guides/${req.file.filename}`;

        await this.guideService.addScreenshot(guideId, filePath);

        res.json({ path: filePath });
    };

    downloadGuidePdf = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const pdfBuffer = await this.guideService.generateGuidePdf(id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=guide-${id}.pdf`,
        );

        res.send(pdfBuffer);
    };
}
