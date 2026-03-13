import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuideService } from '../../services/guide-service';
import { ToastService } from '../../services/toast-service';
import { Guide } from '../../../../../shared/models/guide';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { CommentsComponent } from './gude-comments/guide-comments-page';
import { Location } from '@angular/common';

@Component({
    selector: 'app-read-guide-page',
    imports: [DatePipe, CommentsComponent],
    templateUrl: './read-guide-page.html',
    styleUrl: './read-guide-page.scss',
})
export class ReadGuidePage {
    guide = signal<Guide | null>(null);
    rating = signal<number>(0);
    hoverRating = signal<number>(0);

    constructor(
        private route: ActivatedRoute,
        private guideService: GuideService,
        private toastService: ToastService,
        private authService: AuthService,
        private location: Location,
    ) {}

    async ngOnInit() {
        try {
            const guideId = Number(this.route.snapshot.paramMap.get('guideId'));
            const guideData = await this.guideService.getGuideById(guideId);
            this.guide.set(guideData);
        } catch (err: any) {
            this.toastService.showError('Failed to load guide: ' + err.message);
        }
    }

    async rateGuide(score: number) {
        try {
            const guideId = this.guide()?.id;
            const user = this.authService.getCurrentUser();

            if (!guideId || !user) return;

            await this.guideService.rateGuide(guideId, score, user.id);

            this.rating.set(score);

            this.toastService.showSuccess('Rating saved');
        } catch (err: any) {
            this.toastService.showError('Failed to rate guide');
        }
    }

    activeImage = signal<string | null>(null);

    openImage(url: string) {
        this.activeImage.set(url);
    }

    closeImage() {
        this.activeImage.set(null);
    }

    async downloadPDF() {
        try {
            const guideId = this.guide()?.id;
            if (!guideId) return;

            const pdfBlob = await this.guideService.downloadPdf(guideId);

            const url = window.URL.createObjectURL(pdfBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `guide-${guideId}.pdf`;

            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            this.toastService.showError('Failed to download PDF');
        }
    }
    goBack() {
        this.location.back();
    }
}
