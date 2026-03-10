import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Guide } from '../../../../../shared/models/guide';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-guide-editor-page',
    imports: [FormsModule],
    templateUrl: './guide-editor-page.html',
    styleUrl: './guide-editor-page.scss',
})
export class GuideEditorPage {
    game: any = signal<Game | null>(null);
    user: any = signal<User | null>(null);
    title: string = '';
    content: string = '';
    guideId: number | null = null;
    isEditMode = false;
    selectedFiles: File[] = [];
    gameId: number | null = null;
    userId: number | null = null;

    previewUrls: string[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private gameService: GameService,
        private authService: AuthService,
        private guideService: GuideService,
        private toastService: ToastService,
    ) {
        this.user = toSignal(this.authService.currentUser$);

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

                const guide = await this.guideService.getGuideById(this.guideId);

                this.gameId = guide.gameId;

                this.isEditMode = true;
                this.guideId = Number(guideId);

                // Sicherheitscheck
                if (guide.userId !== this.user()?.id) {
                    this.toastService.showError('You cannot edit this guide.');
                    this.router.navigate(['/games']);
                    return;
                }

                this.title = guide.title;
                this.content = guide.content;

                const gameData = await this.gameService.getGame(guide.gameId);
                this.game.set(gameData);
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

        this.selectedFiles = Array.from(input.files);

        this.previewUrls = [];

        for (const file of this.selectedFiles) {
            const url = URL.createObjectURL(file);
            this.previewUrls.push(url);
        }
    }

    async onSubmit(form: NgForm) {
        if (!form.valid) return;

        if (!this.isEditMode) {
            const guides = await this.guideService.getGuidesByGameId(this.game()?.id);

            const exists = guides.some(
                (g) => g.title === this.title && g.userId === this.user()?.id,
            );

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
        } else {
            guideId = await this.guideService.createGuide(guide);

            if (!guideId) {
                this.toastService.showError('Failed to create guide');
                return;
            }
        }

        // Screenshots hochladen
        for (const file of this.selectedFiles) {
            await this.guideService.uploadScreenshot(guideId, file);
        }

        this.router.navigate(['/games', this.gameId]);

        this.toastService.showSuccess(
            this.isEditMode ? 'Guide updated successfully!' : 'Guide created successfully!',
        );
    }
}
