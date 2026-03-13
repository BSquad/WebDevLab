import { Injectable } from '@angular/core';
import { GuideApi } from '../api/guide-api';
import { Guide } from '../../../../shared/models/guide';

@Injectable({
    providedIn: 'root',
})
export class GuideService {
    constructor(private guideApi: GuideApi) {}

    async getGuidesByGameId(gameId: number): Promise<Guide[]> {
        return await this.guideApi.getGuidesByGameId(gameId);
    }

    async getGuideById(id: number): Promise<Guide> {
        return await this.guideApi.getGuideById(id);
    }

    async getTopGuides(gameId: number): Promise<Guide[]> {
        return await this.guideApi.getTopGuides(gameId);
    }

    async createGuide(guide: Guide): Promise<number> {
        return await this.guideApi.createGuide(guide);
    }

    async updateGuide(id: number, guide: Guide): Promise<boolean> {
        return await this.guideApi.updateGuide(id, guide);
    }

    async deleteGuide(id: number, userId: number): Promise<boolean> {
        return await this.guideApi.deleteGuide(id, userId);
    }

    async rateGuide(guideId: number, rating: number, userId: number): Promise<boolean> {
        return await this.guideApi.rateGuide(guideId, rating, userId);
    }

    async uploadScreenshot(guideId: number, file: File): Promise<boolean> {
        return await this.guideApi.uploadScreenshot(guideId, file);
    }

    async deleteScreenshot(guideId: number, filePath: string): Promise<boolean> {
        return await this.guideApi.deleteScreenshot(guideId, filePath);
    }

    async downloadPdf(guideId: number): Promise<Blob> {
        return await this.guideApi.downloadPdf(guideId);
    }
}
