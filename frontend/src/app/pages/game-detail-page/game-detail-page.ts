import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router  } from '@angular/router';
import { Guide } from '../../../../../shared/models/guide';

@Component({
  selector: 'app-game-detail-page',
  imports: [],
  templateUrl: './game-detail-page.html',
  styleUrl: './game-detail-page.scss',
})
export class GameDetailPage {
  game: any = signal<Game | null>(null);
  guides: any = signal<Guide[]>([]);

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private gameService: GameService, 
    private toastService: ToastService) { }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const data = await this.gameService.getGame(id);
      this.game.set(data);
      //TODO Guides laden
    } catch (err: any) {
      this.toastService.showError('Error: ' + err.message);
    }
  }

  goToReadGuide(guideId: number) {
    this.router.navigate(['/read-guide', guideId]);
  }

  goToEditGuide(guideId: number) {
    this.router.navigate(['/edit-guide', guideId]);
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
