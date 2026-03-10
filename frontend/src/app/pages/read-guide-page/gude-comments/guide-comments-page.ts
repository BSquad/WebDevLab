import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';

import { CommentsService } from '../../../services/comment-service';
import { AuthService } from '../../../services/auth-service';
import { GuideComment } from '../../../../../../shared/models/guide-comment';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [DatePipe, FormsModule],
    templateUrl: './guide-comments-page.html',
    styleUrl: './guide-comments-page.scss',
})
export class CommentsComponent {
    comments = signal<GuideComment[]>([]);
    newComment = '';

    private _guideId!: number;

    @Input()
    set guideId(id: number) {
        if (!id) return;
        this._guideId = id;
        this.loadComments();
    }

    constructor(
        private commentsService: CommentsService,
        private authService: AuthService,
    ) {}

    async loadComments() {
        const data = await this.commentsService.getComments(this._guideId);
        this.comments.set(data);
    }

    async submitComment() {
        const user = this.authService.getCurrentUser();

        if (!user || !this.newComment.trim()) return;

        await this.commentsService.createComment({
            guideId: this._guideId,
            userId: user.id,
            commentText: this.newComment,
        });

        this.newComment = '';

        await this.loadComments();
    }
}
