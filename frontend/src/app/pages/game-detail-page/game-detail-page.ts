import { Component, OnInit, signal, Signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { Guide } from '../../../../../shared/models/guide';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../../../shared/models/user';
import { PathBuilder } from '../../services/path-builder';
import { GuideCardComponent } from '../../ui-components/guide-card/guide-card';

@Component({
    selector: 'app-game-detail-page',
    imports: [GuideCardComponent],
    templateUrl: './game-detail-page.html',
    styleUrl: './game-detail-page.scss',
})
export class GameDetailPage implements OnInit {
    game = signal<Game | null>(null);
    guides = signal<Guide[]>([]);
    user: Signal<User | null>;
    bestUsers = signal<User[]>([]);
    topGuides = signal<Guide[]>([]);

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private gameService: GameService,
        private guideService: GuideService,
        private authService: AuthService,
        private toastService: ToastService,
        private pathBuilder: PathBuilder,
    ) {
        this.user = toSignal(this.authService.currentUser$, { initialValue: null });
    }

    async ngOnInit() {
        try {
            const gameId = Number(this.route.snapshot.paramMap.get('gameId'));

            const [topGuidesData, gameData, guidesData, bestUsersData] = await Promise.all([
                this.guideService.getTopGuides(gameId),
                this.gameService.getGame(gameId, this.user()?.id),
                this.guideService.getGuidesByGameId(gameId),
                this.gameService.getBestUsersByGameId(gameId),
            ]);

            this.topGuides.set(topGuidesData);
            this.game.set(gameData);
            this.guides.set(guidesData);
            this.bestUsers.set(bestUsersData);
        } catch (err: any) {
            this.toastService.showError('Error: ' + err.message);
        }
    }

    isGuideOwner(guide: Guide): boolean {
        const user = this.user();
        return user !== null && guide.userId === user.id;
    }

    goToReadGuide(guide: Guide) {
        this.router.navigate(['/read-guide', guide.id]);
    }

    goToEditGuide(guide: Guide) {
        this.router.navigate(['/edit-guide', guide.id]);
    }

    goToCreateGuide() {
        if (!this.authService.isLoggedIn()) {
            this.toastService.showError('You must be logged in to create a guide.');

            this.router.navigate(['/login'], {
                queryParams: {
                    returnUrl: `/create-guide/${this.game()?.id}`,
                },
            });

            return;
        }

        const gameId = this.game()?.id;
        this.router.navigate(['/create-guide', gameId], {
            state: { game: this.game() },
        });
    }

    goToAchievements() {
        const gameId = this.game()?.id;
        this.router.navigate(['/achievements', gameId]);
    }

    async toggleTrackGame(event: Event) {
        event.stopPropagation();
        try {
            const success = await this.gameService.toggleTrackGame(
                this.game()!.id,
                this.user()!.id,
                this.game()!.isTracked,
            );

            this.game.update((g) => (g ? { ...g, isTracked: !g.isTracked } : null));
        } catch (err: any) {
            this.toastService.showError('Error: ' + err.message);
        }
    }

    getGameImagePath(imageName?: string): string {
        return this.pathBuilder.getGameImagePath(imageName);
    }
}
