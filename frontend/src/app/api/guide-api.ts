import { Injectable } from '@angular/core';
import { Guide } from '../../../../shared/models/guide';
import { BaseApi } from './base-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GuideApi extends BaseApi {
    // MH07 – Guides eines Spiels
    async getGuidesByGameId(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.apiUrl}/guides/game/${gameId}`));
    }

    // MH07 – einzelner Guide
    async getGuideById(id: number): Promise<Guide> {
        return await this.request(this.http.get<Guide>(`${this.apiUrl}/guides/${id}`));
    }

    // MH11 – Guide erstellen
    async createGuide(guide: Guide): Promise<number> {
        return await this.request(this.http.post<number>(`${this.apiUrl}/guides`, guide));
    }

    // MH12 – Guide bearbeiten
    async updateGuide(id: number, guide: Guide): Promise<boolean> {
        return await this.request(this.http.put<boolean>(`${this.apiUrl}/guides/${id}`, guide));
    }

    // MH21 – Guide löschen
    async deleteGuide(id: number, userId: number): Promise<boolean> {
        return await this.request(
            this.http.delete<boolean>(`${this.apiUrl}/guides/${id}`, {
                body: { userId },
            }),
        );
    }

    // MH13 – Guide bewerten
    async rateGuide(guideId: number, rating: number, userId: number): Promise<boolean> {
        return await this.request(
            this.http.post<boolean>(`${this.apiUrl}/guides/${guideId}/rate`, {
                rating: rating,
                userId: userId,
            }),
        );
    }

    // MH10 – Top Guides eines Spiels
    async getTopGuides(gameId: number): Promise<Guide[]> {
        return await this.request(this.http.get<Guide[]>(`${this.apiUrl}/guides/top/${gameId}`));
    }

    // MH14 – Screenshot Upload
    async uploadScreenshot(guideId: number, file: File): Promise<boolean> {
        const formData = new FormData();
        formData.append('image', file);

        return await this.request(
            this.http.post<boolean>(`${this.apiUrl}/guides/${guideId}/upload`, formData),
        );
    }

    // Delete Screenshot
    async deleteScreenshot(guideId: number, filePath: string): Promise<boolean> {
        return await this.request(
            this.http.delete<boolean>(`${this.apiUrl}/guides/${guideId}/screenshot`, {
                body: { filePath },
            }),
        );
    }

    // MH15 – PDF Download
    async downloadPdf(guideId: number): Promise<Blob> {
        return await this.request(
            this.http.get(`${this.apiUrl}/guides/${guideId}/pdf`, {
                responseType: 'blob',
            }) as Observable<Blob>,
        );
    }
}
