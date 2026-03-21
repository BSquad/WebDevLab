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
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';

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
        private dialog: MatDialog,
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
        } catch (err: any) {
            console.error('Guide editor initialization failed', err);
            const message = err?.error?.message || 'The guide could not be loaded.';
            this.toastService.showError(message);
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
        if (!form.valid) {
            let errors: string[] = [];

            if (form.controls['title']?.invalid) {
                errors.push('Title is required');
            }

            if (form.controls['content']?.invalid) {
                errors.push('Content is required');
            }

            this.toastService.showError(errors.join(' | '));

            Object.values(form.controls).forEach((control) => {
                control.markAsTouched();
            });

            return;
        }

        try {
            const guideId = await this.guideService.saveGuideWithScreenshots(this.guide, {
                isEditMode: this.isEditMode,
                guideId: this.guideId ?? undefined,
                userId: this.userId!,
                newFiles: this.selectedFiles,
                deletedScreenshots: this.deletedScreenshots,
            });

            this.router.navigate(['/games', this.gameId]);

            this.toastService.showSuccess(
                this.isEditMode ? 'Guide updated successfully!' : 'Guide created successfully!',
            );
        } catch (err: any) {
            if (err.message === 'UPLOAD_FAILED') {
                this.toastService.showError('A screenshot could not be uploaded.');
            } else {
                const message = err?.error?.message || 'The guide could not be saved.';
                this.toastService.showError(message);
            }
        }
    }

    async deleteGuide() {
        if (!this.guideId || !this.userId) return;

        const dialogRef = this.dialog.open(ConfirmDialog, {
            width: 'auto',
            data: {
                title: 'WARNING',
                message: 'THIS ACTION WILL DELETE YOUR GUIDE. CONTINUE?',
            },
        });

        const confirmed = await firstValueFrom(dialogRef.afterClosed());
        if (!confirmed) return;

        try {
            await this.guideService.deleteGuide(this.guideId, this.userId);

            this.toastService.showSuccess('Guide deleted');
            this.router.navigate(['/games', this.game()?.id]);
        } catch (err: any) {
            console.error('Guide deletion failed', err);
            const message = err?.error?.message || 'The guide could not be deleted.';
            this.toastService.showError(message);
        }
    }

    goBack() {
        this.location.back();
    }
}
