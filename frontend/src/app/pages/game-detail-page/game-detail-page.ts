import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-game-detail-page',
  imports: [],
  templateUrl: './game-detail-page.html',
  styleUrl: './game-detail-page.scss',
})
export class GameDetailPage {
  game: any = signal<Game | null>(null);

  constructor(private route: ActivatedRoute, private gameService: GameService, private toastService: ToastService) { }

  async ngOnInit() {
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      const data = await this.gameService.getGame(id);
      this.game.set(data);
    } catch (err) {
      this.toastService.showError('Fehler beim Laden: ' + err);
    }
  }
}
