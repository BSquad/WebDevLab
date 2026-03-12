import type { Guide } from '../../../shared/models/guide.ts';
import { GuideDbAccess } from '../db-access/guide-db-access.js';

export class GuideService {
    private guideDbAccess: GuideDbAccess = new GuideDbAccess();

    createGuide = async (guide: Guide): Promise<number> => {
        return await this.guideDbAccess.addGuide(guide);
    };

    getGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
        return await this.guideDbAccess.getGuidesByGameId(gameId);
    };

    getGuideById = async (id: number): Promise<Guide | undefined> => {
        return await this.guideDbAccess.getGuideById(id);
    };

    async getGuidesByUserId(userId: number) {
        return await this.guideDbAccess.getGuidesByUserId(userId);
    }

    updateGuide = async (id: number, userId: number, guide: Guide) => {
        const updated = await this.guideDbAccess.updateGuide(id, userId, guide);

        if (!updated) {
            throw new Error('Guide not found or no permission');
        }
    };

    deleteGuide = async (id: number, userId: number) => {
        const deleted = await this.guideDbAccess.deleteGuide(id, userId);

        if (!deleted) {
            throw new Error('Guide not found or no permission');
        }
    };

    rateGuide = async (guideId: number, userId: number, score: number) => {
        if (score < 1 || score > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        await this.guideDbAccess.rateGuide(guideId, userId, score);
    };

    getTopGuidesByGameId = async (gameId: number) => {
        return await this.guideDbAccess.getTopGuidesByGameId(gameId);
    };

    addScreenshot = async (guideId: number, filePath: string) => {
        await this.guideDbAccess.addScreenshot(guideId, filePath);
    };

    generateGuidePdf = async (id: number): Promise<Buffer> => {
        const guide = await this.guideDbAccess.getGuideById(id);

        if (!guide) {
            throw new Error('Guide not found');
        }

        const PDFDocument = (await import('pdfkit')).default;
        const doc = new PDFDocument();

        const chunks: Buffer[] = [];

        return new Promise((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Titel
            doc.fontSize(20).text(guide.title, { underline: true });
            doc.moveDown();

            // Author
            if (guide.author) {
                doc.fontSize(12).text(`Author: ${guide.author}`);
                doc.moveDown();
            }

            // Datum
            if (guide.createdAt) {
                doc.fontSize(10).text(`Created: ${guide.createdAt}`);
                doc.moveDown();
            }

            // Content
            doc.fontSize(12).text(guide.content, {
                align: 'left',
            });

            doc.end();
        });
    };
}
