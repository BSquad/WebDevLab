import type { Request, Response } from 'express';
import { GuideService } from '../services/guide-service.js';
import type { Guide } from '../../../shared/models/guide.ts';

export class GuideController {
    private guideService: GuideService = new GuideService();

    createGuide = async (req: Request, res: Response) => {
        const guide = req.body as Guide;
        await this.guideService.createGuide(guide);
        res.json(true);
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
        const { userId, score } = req.body;

        await this.guideService.rateGuide(
            guideId,
            Number(userId),
            Number(score),
        );

        res.json(true);
    };

    getTopGuidesByGameId = async (req: Request, res: Response) => {
        const gameId = Number(req.params.gameId);
        const guides = await this.guideService.getTopGuidesByGameId(gameId);
        res.json(guides);
    };

    uploadScreenshot = async (req: Request, res: Response) => {
        const guideId = Number(req.params.id);

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = `/images/guides/${req.file.filename}`;

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
