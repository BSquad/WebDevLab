import { Injectable } from '@angular/core';
import { GuideApi } from '../api/guide-api';
import { Guide } from '../../../../shared/models/guide';

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    constructor(private guideApi: GuideApi) {}

    async getGuidesByGameId(gameId: number): Promise<Guide[]> {
        return this.guideApi.getGuidesByGameId(gameId);
    }

    async getGuideById(id: number): Promise<Guide> {
        return this.guideApi.getGuideById(id);
    }

    async getTopGuides(gameId: number): Promise<Guide[]> {
        return this.guideApi.getTopGuides(gameId);
    }

    async createGuide(guide: Guide): Promise<number> {
        const result = await this.guideApi.createGuide(guide);

        if (!result?.id) {
            throw new Error('CREATE_FAILED');
        }

        return result.id;
    }

    async updateGuide(id: number, guide: Guide, userId: number): Promise<void> {
        await this.guideApi.updateGuide(id, guide, userId);
    }

    async deleteGuide(id: number, userId: number): Promise<void> {
        await this.guideApi.deleteGuide(id, userId);
    }

    async rateGuide(guideId: number, rating: number, userId: number): Promise<void> {
        await this.guideApi.rateGuide(guideId, rating, userId);
    }

    async uploadScreenshot(guideId: number, file: File): Promise<string> {
        const result = await this.guideApi.uploadScreenshot(guideId, file);
        return result.path;
    }

    async deleteScreenshot(guideId: number, filePath: string): Promise<void> {
        await this.guideApi.deleteScreenshot(guideId, filePath);
    }

    async rateGuideAndRefresh(guideId: number, rating: number, userId: number): Promise<Guide> {
        await this.guideApi.rateGuide(guideId, rating, userId);
        return this.guideApi.getGuideById(guideId);
    }

    async downloadPdfFile(guideId: number): Promise<void> {
        const pdfBlob = await this.guideApi.downloadPdf(guideId);

        const url = window.URL.createObjectURL(pdfBlob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `guide-${guideId}.pdf`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    async saveGuideWithScreenshots(
        guide: Guide,
        options: {
            isEditMode: boolean;
            guideId?: number;
            userId: number;
            newFiles: File[];
            deletedScreenshots: string[];
        },
    ): Promise<number> {
        let guideId = options.guideId;

        if (options.isEditMode && guideId) {
            await this.guideApi.updateGuide(guideId, guide, options.userId);

            for (const filePath of options.deletedScreenshots) {
                await this.guideApi.deleteScreenshot(guideId, filePath);
            }
        } else {
            const result = await this.guideApi.createGuide(guide);
            guideId = result.id;

            if (!guideId) {
                throw new Error('CREATE_FAILED');
            }
        }

        for (const file of options.newFiles) {
            try {
                await this.guideApi.uploadScreenshot(guideId!, file);
            } catch {
                if (!options.isEditMode && guideId) {
                    await this.guideApi.deleteGuide(guideId, options.userId);
                }

                throw new Error('UPLOAD_FAILED');
            }
        }

        return guideId!;
    }
}
