import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ToastService } from '../../services/toast-service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-game-list',
  imports: [],
  templateUrl: './game-list-page.html',
  styleUrl: './game-list-page.scss',
})
export class GameListPage {
  games = signal<Game[]>([]);
  user: any = signal<User | null>(null);

  constructor(
    private router: Router,
    private gameService: GameService,
    private toastService: ToastService,
    private authService: AuthService) {
    this.user = toSignal(this.authService.currentUser$);
  }

  async ngOnInit() {
    try {
      const data = await this.gameService.getGames(this.user()?.id);
      this.games.set(data);
    } catch (err) {
      this.toastService.showError('Error: ' + err);
    }
  }

  goToGame(gameId: number) {
    this.router.navigate(['/games', gameId]);
  }

  async toggleTrackGame(game: Game, event: Event) {
    event.stopPropagation();
    const success = await this.gameService.toggleTrackGame(game.id, this.user()!.id, game.isTracked);

    if (success) {
      this.games.update(list =>
        list.map(g =>
          g.id === game.id ? { ...g, isTracked: !g.isTracked } : g
        )
      );
    }
  }
}
