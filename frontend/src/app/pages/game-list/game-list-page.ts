import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ToastService } from '../../services/toast-service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game-service';

@Component({
  selector: 'app-game-list',
  imports: [],
  templateUrl: './game-list-page.html',
  styleUrl: './game-list-page.scss',
})
export class GameListPage {
  games: any = signal<Game[]>([]);

  constructor(private router: Router, private gameService: GameService, private toastService: ToastService) { }

  async ngOnInit() {
    try {
      const data = await this.gameService.getGames();
      this.games.set(data);
    } catch (err) {
      this.toastService.showError('Error: ' + err);
    }
  }

  goToGame(gameId: number) {
    this.router.navigate(['/games', gameId]);
  }
}
