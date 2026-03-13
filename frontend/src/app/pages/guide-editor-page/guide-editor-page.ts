import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Guide } from '../../../../../shared/models/guide';
import { AuthService } from '../../services/auth-service';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
    selector: 'app-guide-editor-page',
    imports: [FormsModule],
    templateUrl: './guide-editor-page.html',
    styleUrl: './guide-editor-page.scss',
})
export class GuideEditorPage {
    game = signal<Game | null>(null);

    title: string = '';
    content: string = '';

    guideId: number | null = null;
    gameId: number | null = null;
    userId: number | null = null;

    isEditMode = false;

    guide: Guide | null = null;

    selectedFiles: File[] = [];
    previewUrls: string[] = [];
    deletedScreenshots: string[] = [];

    activeImage = signal<string | null>(null);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private gameService: GameService,
        private authService: AuthService,
        private guideService: GuideService,
        private toastService: ToastService,
        private location: Location,
        private cdr: ChangeDetectorRef,
    ) {
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
            this.userId = currentUser.id;
        }
    }

    async ngOnInit() {
        try {
            const guideId = this.route.snapshot.paramMap.get('guideId');

            if (guideId) {
                // EDIT MODE
                this.guideId = Number(guideId);
                this.isEditMode = true;

                this.guide = await this.guideService.getGuideById(this.guideId);

                console.log('Loaded guide:', this.guide);

                this.loadExistingScreenshots();
                this.cdr.detectChanges();

                if (!this.guide) {
                    this.toastService.showError('Guide not found');
                    this.router.navigate(['/games']);
                    return;
                }

                // Sicherheitscheck
                if (this.guide.userId !== this.userId) {
                    this.toastService.showError('You cannot edit this guide.');
                    this.router.navigate(['/games']);
                    return;
                }

                this.gameId = this.guide.gameId;

                this.title = this.guide.title;
                this.content = this.guide.content;

                this.loadExistingScreenshots();

                this.cdr.detectChanges();

                const gameData = await this.gameService.getGame(this.guide.gameId);
                this.game.set(gameData);

                this.loadExistingScreenshots();
            } else {
                // CREATE MODE
                const gameId = Number(this.route.snapshot.paramMap.get('gameId'));

                this.gameId = gameId;

                const gameData = await this.gameService.getGame(gameId);
                this.game.set(gameData);
            }
        } catch (err) {
            this.toastService.showError('Error: ' + err);
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;

        if (!input.files) return;

        const files = Array.from(input.files);

        for (const file of files) {
            this.selectedFiles.push(file);

            const preview = URL.createObjectURL(file);

            this.previewUrls.push(preview);
        }

        input.value = '';
    }

    loadExistingScreenshots() {
        if (!this.guide || !this.guide.screenshots) return;

        this.previewUrls = [];

        for (const shot of this.guide.screenshots) {
            const url = 'http://localhost:3000' + shot;

            this.previewUrls.push(url);
        }
    }

    removeScreenshot(index: number) {
        const url = this.previewUrls[index];

        if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
            this.selectedFiles.splice(index, 1);
        } else {
            const filePath = url.replace('http://localhost:3000', '');

            this.deletedScreenshots.push(filePath);
        }

        this.previewUrls.splice(index, 1);
    }

    openImage(url: string) {
        this.activeImage.set(url);
    }

    closeImage() {
        this.activeImage.set(null);
    }

    async onSubmit(form: NgForm) {
        if (!form.valid) return;

        if (!this.isEditMode) {
            const guides = await this.guideService.getGuidesByGameId(this.gameId!);

            const exists = guides.some((g) => g.title === this.title && g.userId === this.userId);

            if (exists) {
                this.toastService.showError('You already created a guide with this title.');
                return;
            }
        }

        const guide: Guide = {
            title: this.title,
            content: this.content,
            gameId: this.gameId!,
            userId: this.userId!,
        };

        let guideId: number;

        if (this.isEditMode && this.guideId) {
            const success = await this.guideService.updateGuide(this.guideId, guide);

            if (!success) {
                this.toastService.showError('Failed to update guide');
                return;
            }

            guideId = this.guideId;

            // Screenshots löschen (EDIT MODE)
            for (const filePath of this.deletedScreenshots) {
                await this.guideService.deleteScreenshot(guideId, filePath);
            }
        } else {
            guideId = await this.guideService.createGuide(guide);

            if (!guideId) {
                this.toastService.showError('Failed to create guide');
                return;
            }
        }

        // Neue Screenshots hochladen
        for (const file of this.selectedFiles) {
            await this.guideService.uploadScreenshot(guideId, file);
        }

        this.router.navigate(['/games', this.gameId]);

        this.toastService.showSuccess(
            this.isEditMode ? 'Guide updated successfully!' : 'Guide created successfully!',
        );
    }

    async deleteGuide() {
        if (!this.guideId || !this.userId) return;

        const confirmed = confirm('Are you sure you want to delete this guide?');

        if (!confirmed) return;

        const success = await this.guideService.deleteGuide(this.guideId, this.userId);

        if (success) {
            this.toastService.showSuccess('Guide deleted');

            this.router.navigate(['/games', this.gameId]);
        }
    }

    goBack() {
        this.location.back();
    }
}
