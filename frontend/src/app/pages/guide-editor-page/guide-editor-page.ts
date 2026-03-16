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
    standalone: true,
    imports: [FormsModule],
    templateUrl: './guide-editor-page.html',
    styleUrl: './guide-editor-page.scss',
})
export class GuideEditorPage {
    game = signal<Game | null>(null);

    guide: Guide = {
        title: '',
        content: '',
        gameId: 0,
        userId: 0,
    };

    guideId: number | null = null;
    gameId: number | null = null;
    userId: number | null = null;

    isEditMode = false;
    isLoaded = false;

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
            const guideIdParam = this.route.snapshot.paramMap.get('guideId');

            if (guideIdParam) {
                this.isEditMode = true;
                this.guideId = Number(guideIdParam);

                const guideData = await this.guideService.getGuideById(this.guideId);

                if (!guideData) {
                    this.toastService.showError('Guide not found');
                    this.router.navigate(['/games']);
                    return;
                }

                if (guideData.userId !== this.userId) {
                    this.toastService.showError('You cannot edit this guide.');
                    this.router.navigate(['/games']);
                    return;
                }

                this.guide = guideData;
                this.gameId = guideData.gameId;

                this.loadExistingScreenshots();
                this.cdr.detectChanges();
                const gameData = await this.gameService.getGame(guideData.gameId);
                this.game.set(gameData);
            } else {
                const gameId = Number(this.route.snapshot.paramMap.get('gameId'));

                this.gameId = gameId;

                const gameData = await this.gameService.getGame(gameId);
                this.game.set(gameData);

                this.guide.gameId = gameId;
                this.guide.userId = this.userId!;
            }
        } catch (err) {
            console.error('Guide editor initialization failed', err);
            this.toastService.showError('The guide could not be loaded.');
        } finally {
            this.isLoaded = true;
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
        if (!this.guide.screenshots) return;

        this.previewUrls = this.guide.screenshots.map((shot) => 'http://localhost:3000' + shot);
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

        let guideId: number;

        try {
            if (this.isEditMode && this.guideId) {
                const success = await this.guideService.updateGuide(this.guideId, this.guide);

                if (!success) {
                    this.toastService.showError('Guide could not be updated.');
                    return;
                }

                guideId = this.guideId;

                for (const filePath of this.deletedScreenshots) {
                    await this.guideService.deleteScreenshot(guideId, filePath);
                }
            } else {
                guideId = await this.guideService.createGuide(this.guide);

                if (!guideId) {
                    this.toastService.showError('Guide could not be created.');
                    return;
                }
            }

            for (const file of this.selectedFiles) {
                try {
                    const success = await this.guideService.uploadScreenshot(guideId, file);

                    if (!success) {
                        throw new Error();
                    }
                } catch (err) {
                    console.error('Screenshot upload failed', err);

                    if (!this.isEditMode) {
                        await this.guideService.deleteGuide(guideId, this.userId!);
                    }

                    this.toastService.showError('A screenshot could not be uploaded.');
                    return;
                }
            }

            this.router.navigate(['/games', this.gameId]);

            this.toastService.showSuccess(
                this.isEditMode ? 'Guide updated successfully!' : 'Guide created successfully!',
            );
        } catch (err) {
            console.error('Guide save failed', err);
            this.toastService.showError('The guide could not be saved.');
        }
    }

    async deleteGuide() {
        if (!this.guideId || !this.userId) return;

        const confirmed = confirm('Are you sure you want to delete this guide?');

        if (!confirmed) return;

        try {
            const success = await this.guideService.deleteGuide(this.guideId, this.userId);

            if (success) {
                this.toastService.showSuccess('Guide deleted');
                this.router.navigate(['/games', this.gameId]);
            }
        } catch (err) {
            console.error('Guide deletion failed', err);
            this.toastService.showError('The guide could not be deleted.');
        }
    }

    goBack() {
        this.location.back();
    }
}
