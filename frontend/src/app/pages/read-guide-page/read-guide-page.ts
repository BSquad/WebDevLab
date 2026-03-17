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

    activeImage = signal<string | null>(null);

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

            if (!guideId) {
                console.error('Invalid guideId in route');
                return;
            }

            const guideData = await this.guideService.getGuideById(guideId);
            this.guide.set(guideData);
        } catch (err) {
            console.error('Failed to load guide', err);
            this.toastService.showError('The guide could not be loaded.');
        }
    }

    async rateGuide(score: number) {
        const guideId = this.guide()?.id;
        const user = this.authService.getCurrentUser();

        if (!guideId || !user) return;

        try {
            const updatedGuide = await this.guideService.rateGuideAndRefresh(
                guideId,
                score,
                user.id,
            );

            this.rating.set(score);
            this.guide.set(updatedGuide);

            this.toastService.showSuccess('Rating saved');
        } catch {
            this.toastService.showError('The rating could not be saved.');
        }
    }

    openImage(url: string) {
        this.activeImage.set(url);
    }

    closeImage() {
        this.activeImage.set(null);
    }

    async downloadPDF() {
        const guideId = this.guide()?.id;

        if (!guideId) return;

        try {
            await this.guideService.downloadPdfFile(guideId);
        } catch {
            this.toastService.showError('The PDF could not be downloaded.');
        }
    }

    goBack() {
        this.location.back();
    }
}
