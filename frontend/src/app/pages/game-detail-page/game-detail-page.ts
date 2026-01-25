import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-game-detail-page',
  imports: [],
  templateUrl: './game-detail-page.html',
  styleUrl: './game-detail-page.scss',
})
export class GameDetailPage {
  game: any = signal<Game | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private gameService: GameService, private toastService: ToastService) { }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const data = await this.gameService.getGame(id);
      this.game.set(data);
    } catch (err: any) {
      this.toastService.showError('Error: ' + err.message);
    }
  }

  goToCreateGuide() {
    const gameId = this.game().id;
    this.router.navigate(['/create-guide', gameId], { state: { game: this.game() } });
  }
}
