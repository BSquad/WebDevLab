import { Injectable } from '@angular/core';
import { Guide } from '../../../../shared/models/guide';
import { BaseApi } from './base-api';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../services/toast-service';

@Injectable({
    providedIn: 'root',
})
export class GuideApi extends BaseApi {
    constructor(http: HttpClient, toast: ToastService) {
        super(http, toast);
    }

    private guideUrl = `${this.apiUrl}/guides`;

    async getGuidesByGameId(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.guideUrl}/game/${gameId}`));
    }

    async getGuideById(id: number): Promise<Guide> {
        return await this.request(this.http.get<Guide>(`${this.guideUrl}/${id}`));
    }

    async getTopGuides(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.guideUrl}/top/${gameId}`));
    }

    async createGuide(guide: Guide): Promise<{ id: number }> {
        return await this.request(this.http.post<{ id: number }>(this.guideUrl, guide));
    }

    async updateGuide(id: number, guide: Guide, userId: number): Promise<{ message: string }> {
        return await this.request(
            this.http.put<{ message: string }>(`${this.guideUrl}/${id}`, {
                ...guide,
                userId,
            }),
        );
    }

    async deleteGuide(id: number, userId: number): Promise<{ message: string }> {
        return await this.request(
            this.http.delete<{ message: string }>(`${this.guideUrl}/${id}`, {
                body: { userId },
            }),
        );
    }

    async rateGuide(guideId: number, rating: number, userId: number): Promise<{ message: string }> {
        return await this.request(
            this.http.post<{ message: string }>(`${this.guideUrl}/${guideId}/rate`, {
                rating,
                userId,
            }),
        );
    }

    async uploadScreenshot(guideId: number, file: File): Promise<{ path: string }> {
        const formData = new FormData();
        formData.append('uploadType', 'guides');
        formData.append('image', file);

        return await this.request(
            this.http.post<{ path: string }>(`${this.guideUrl}/${guideId}/upload`, formData),
        );
    }

    async deleteScreenshot(guideId: number, filePath: string): Promise<{ message: string }> {
        return await this.request(
            this.http.delete<{ message: string }>(`${this.guideUrl}/${guideId}/screenshot`, {
                body: { filePath },
            }),
        );
    }

    async downloadPdf(guideId: number): Promise<Blob> {
        return await this.request(
            this.http.get<Blob>(`${this.guideUrl}/${guideId}/pdf`, {
                responseType: 'blob' as 'json',
            }),
        );
    }
}
