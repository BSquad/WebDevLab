import { Injectable } from '@angular/core';
import { CommentsApi } from '../api/comments-api';
import { GuideComment } from '../../../../shared/models/guide-comment';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    constructor(private commentsApi: CommentsApi) {}

    async getComments(guideId: number): Promise<GuideComment[]> {
        return await this.commentsApi.getComments(guideId);
    }

    async createComment(comment: GuideComment): Promise<void> {
        await this.commentsApi.createComment(comment);
    }
}
