import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router  } from '@angular/router';
import { Guide } from '../../../../../shared/models/guide';
import { DatePipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../../../shared/models/user';

@Component({
  selector: 'app-game-detail-page',
  imports: [SlicePipe, DatePipe],
  templateUrl: './game-detail-page.html',
  styleUrl: './game-detail-page.scss',
})
export class GameDetailPage {
  game: any = signal<Game | null>(null);
  guides: any = signal<Guide[]>([]);
  user: any = signal<User | null>(null);

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private gameService: GameService, 
    private guideService: GuideService,
    private authService: AuthService,
    private toastService: ToastService) {
      this.user = toSignal(this.authService.currentUser$);
     }

  async ngOnInit() {
    try {
      const gameId = Number(this.route.snapshot.paramMap.get('gameId'));
      const gameData = await this.gameService.getGame(gameId);
      this.game.set(gameData);
      const guidesData = await this.guideService.getGuidesByGameId(gameId);
      this.guides.set(guidesData);
    } catch (err: any) {
      this.toastService.showError('Error: ' + err.message);
    }
  }

  isGuideOwner(guide: Guide): boolean {
    const user = this.user();
    return user !== null && guide.authorId === user.id;
  }

  goToReadGuide(guide: Guide) {
    this.router.navigate(['/read-guide', guide.id]);
  }

  goToEditGuide(guide: Guide) {
    this.router.navigate(['/edit-guide', guide.id]);
  }

  goToCreateGuide() {
    const gameId = this.game().id;
    this.router.navigate(['/create-guide', gameId], { state: { game: this.game() } });
  }

  goToAchievements() {
    const gameId = this.game()?.id;
    this.router.navigate(['/achievements', gameId]);
  }
}
