import { Component, Input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommentsService } from '../../../services/comment-service';
import { AuthService } from '../../../services/auth-service';
import { ToastService } from '../../../services/toast-service';
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
        private toastService: ToastService,
    ) {}

    async loadComments() {
        try {
            const data = await this.commentsService.getComments(this._guideId);
            this.comments.set(data);
        } catch (err) {
            console.error('Failed to load comments', err);
            this.toastService.showError('Comments could not be loaded.');
        }
    }

    async submitComment() {
        const user = this.authService.getCurrentUser();

        if (!user || !this.newComment.trim()) return;

        try {
            await this.commentsService.createComment({
                guideId: this._guideId,
                userId: user.id,
                commentText: this.newComment,
            });

            this.newComment = '';

            await this.loadComments();
        } catch (err) {
            console.error('Failed to create comment', err);
            this.toastService.showError('Your comment could not be posted.');
        }
    }
}
