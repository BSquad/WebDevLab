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
        return this.guideApi.createGuide(guide);
    }

    async updateGuide(id: number, guide: Guide): Promise<boolean> {
        return this.guideApi.updateGuide(id, guide);
    }

    async deleteGuide(id: number, userId: number): Promise<boolean> {
        return this.guideApi.deleteGuide(id, userId);
    }

    async rateGuide(guideId: number, rating: number, userId: number): Promise<boolean> {
        return this.guideApi.rateGuide(guideId, rating, userId);
    }

    async uploadScreenshot(guideId: number, file: File): Promise<boolean> {
        return this.guideApi.uploadScreenshot(guideId, file);
    }

    async deleteScreenshot(guideId: number, filePath: string): Promise<boolean> {
        return this.guideApi.deleteScreenshot(guideId, filePath);
    }

    async downloadPdf(guideId: number): Promise<Blob> {
        return this.guideApi.downloadPdf(guideId);
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

    // ✅ NEU: ZENTRALE SAVE LOGIK
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

        // 1. Guide speichern
        if (options.isEditMode && guideId) {
            const success = await this.guideApi.updateGuide(guideId, guide);
            if (!success) throw new Error('UPDATE_FAILED');

            for (const filePath of options.deletedScreenshots) {
                await this.guideApi.deleteScreenshot(guideId, filePath);
            }
        } else {
            guideId = await this.guideApi.createGuide(guide);
            if (!guideId) throw new Error('CREATE_FAILED');
        }

        // 2. Screenshots hochladen
        for (const file of options.newFiles) {
            try {
                const success = await this.guideApi.uploadScreenshot(guideId!, file);
                if (!success) throw new Error();
            } catch {
                if (!options.isEditMode) {
                    await this.guideApi.deleteGuide(guideId!, options.userId);
                }
                throw new Error('UPLOAD_FAILED');
            }
        }

        return guideId!;
    }
}
