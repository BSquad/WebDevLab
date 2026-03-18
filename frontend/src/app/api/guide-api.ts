import { Injectable } from '@angular/core';
import { Guide } from '../../../../shared/models/guide';
import { BaseApi } from './base-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GuideApi extends BaseApi {
    async getGuidesByGameId(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.apiUrl}/guides/game/${gameId}`));
    }

    async getGuideById(id: number): Promise<Guide> {
        return await this.request(this.http.get<Guide>(`${this.apiUrl}/guides/${id}`));
    }

    async createGuide(guide: Guide): Promise<number> {
        return await this.request(this.http.post<number>(`${this.apiUrl}/guides`, guide));
    }

    async updateGuide(id: number, guide: Guide): Promise<boolean> {
        return await this.request(this.http.put<boolean>(`${this.apiUrl}/guides/${id}`, guide));
    }

    async deleteGuide(id: number, userId: number): Promise<boolean> {
        return await this.request(
            this.http.delete<boolean>(`${this.apiUrl}/guides/${id}`, {
                body: { userId },
            }),
        );
    }

    async rateGuide(guideId: number, rating: number, userId: number): Promise<boolean> {
        return await this.request(
            this.http.post<boolean>(`${this.apiUrl}/guides/${guideId}/rate`, {
                rating: rating,
                userId: userId,
            }),
        );
    }

    async getTopGuides(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.apiUrl}/guides/top/${gameId}`));
    }

    async uploadScreenshot(guideId: number, file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('uploadType', 'guides');
        formData.append('image', file);

        return await this.request(
            this.http.post<boolean>(`${this.apiUrl}/guides/${guideId}/upload`, formData),
        );
    }

    async deleteScreenshot(guideId: number, filePath: string): Promise<boolean> {
        return await this.request(
            this.http.delete<boolean>(`${this.apiUrl}/guides/${guideId}/screenshot`, {
                body: { filePath },
            }),
        );
    }

    async downloadPdf(guideId: number): Promise<Blob> {
        return await this.request(
            this.http.get(`${this.apiUrl}/guides/${guideId}/pdf`, {
                responseType: 'blob',
            }) as Observable<Blob>,
        );
    }
}
