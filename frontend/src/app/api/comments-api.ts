import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { GuideComment } from '../../../../shared/models/guide-comment';

@Injectable({
    providedIn: 'root',
})
export class CommentsApi extends BaseApi {
    async getComments(guideId: number): Promise<GuideComment[]> {
        return await this.request(
            this.http.get<GuideComment[]>(`${this.apiUrl}/comments/${guideId}`),
        );
    }

    // 🔥 FIXED
    async createComment(comment: GuideComment): Promise<{ message: string }> {
        return await this.request(
            this.http.post<{ message: string }>(`${this.apiUrl}/comments`, comment),
        );
    }
}
