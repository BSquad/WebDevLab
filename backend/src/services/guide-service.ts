import type { Guide } from '../../../shared/models/guide.ts';
import { GuideDbAccess } from '../db-access/guide-db-access.js';

export class GuideService {
    private guideDbAccess = new GuideDbAccess();

    createGuide = async (guide: Guide): Promise<number> => {
        try {
            return await this.guideDbAccess.addGuide(guide);
        } catch (err: any) {
            if (
                err.message?.includes('UNIQUE constraint failed') ||
                err.message?.includes('SQLITE_CONSTRAINT')
            ) {
                throw new Error('DUPLICATE_GUIDE');
            }
            throw err;
        }
    };

    getGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
        return this.guideDbAccess.getGuidesByGameId(gameId);
    };

    getGuideById = async (id: number): Promise<Guide | null> => {
        const guide = await this.guideDbAccess.getGuideById(id);
        return guide || null;
    };

    getGuidesByUserId = async (userId: number): Promise<Guide[]> => {
        return this.guideDbAccess.getGuidesByUserId(userId);
    };

    updateGuide = async (id: number, userId: number, guide: Guide) => {
        const updated = await this.guideDbAccess.updateGuide(id, userId, guide);

        if (!updated) {
            throw new Error('NOT_FOUND_OR_NO_PERMISSION');
        }
    };

    deleteGuide = async (id: number, userId: number) => {
        const deleted = await this.guideDbAccess.deleteGuide(id, userId);

        if (!deleted) {
            throw new Error('NOT_FOUND_OR_NO_PERMISSION');
        }
    };

    rateGuide = async (guideId: number, userId: number, score: number) => {
        if (!Number.isInteger(score) || score < 1 || score > 5) {
            throw new Error('INVALID_RATING');
        }
        await this.guideDbAccess.rateGuide(guideId, userId, score);
    };

    getTopGuidesByGameId = async (gameId: number) => {
        return this.guideDbAccess.getTopGuidesByGameId(gameId);
    };

    addScreenshot = async (guideId: number, filePath: string) => {
        await this.guideDbAccess.addScreenshot(guideId, filePath);
    };

    deleteScreenshot = async (guideId: number, filePath: string) => {
        await this.guideDbAccess.deleteScreenshot(guideId, filePath);
    };

    generateGuidePdf = async (id: number): Promise<Buffer> => {
        const guide = await this.guideDbAccess.getGuideById(id);

        if (!guide) {
            throw new Error('GUIDE_NOT_FOUND');
        }

        const screenshots =
            await this.guideDbAccess.getScreenshotsByGuideId(id);

        const PDFDocument = (await import('pdfkit')).default;
        const path = await import('path');
        const fs = await import('fs');

        const doc = new PDFDocument({ margin: 60 });

        const chunks: Buffer[] = [];

        return new Promise((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.fontSize(22).text(guide.title, { align: 'center' });
            doc.moveDown();

            doc.fontSize(10).fillColor('#555');

            if (guide.author) {
                doc.text(`Author: ${guide.author}`);
            }

            if (guide.createdAt) {
                doc.text(`Created: ${guide.createdAt}`);
            }

            doc.moveDown();

            doc.fillColor('#000');
            doc.fontSize(12).text(guide.content);
            doc.moveDown();

            if (screenshots.length > 0) {
                doc.addPage();
                doc.fontSize(18).text('Screenshots');
                doc.moveDown();

                screenshots.forEach((shot: any, index: number) => {
                    const imagePath = path.join(
                        process.cwd(),
                        shot.filePath.replace(/^\/+/, ''),
                    );

                    if (!fs.existsSync(imagePath)) return;

                    try {
                        doc.text(`Picture ${index + 1}`);
                        doc.image(imagePath, {
                            fit: [400, 300],
                            align: 'center',
                        });
                        doc.moveDown();
                    } catch (err) {
                        console.log('PDF image error:', err);
                    }
                });
            }

            doc.end();
        });
    };
}
