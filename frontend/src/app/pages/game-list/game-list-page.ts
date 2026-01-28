import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ToastService } from '../../services/toast-service';
import { Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth-service';
import { PathBuilder } from '../../services/path-builder';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-list',
  imports: [FormsModule],
  templateUrl: './game-list-page.html',
  styleUrl: './game-list-page.scss',
})
export class GameListPage {
  games = signal<Game[]>([]);
  popularGames = signal<Game[]>([]);
  user: any = signal<User | null>(null);

  filters = {
    title: '',
    tags: {} as Record<string, boolean>,
    releaseFrom: '',
    releaseTo: ''
  };

  constructor(
    private router: Router,
    private gameService: GameService,
    private toastService: ToastService,
    private authService: AuthService,
    private pathBuilder: PathBuilder) {
    this.user = toSignal(this.authService.currentUser$);
  }

  async ngOnInit() {
    try {
      const data = await this.gameService.getGames(this.user()?.id);
      this.games.set(data);
      const popularGames = await this.gameService.getPopularGames();
      this.popularGames.set(popularGames);
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

  getGameImagePath(imageName?: string): string {
    return this.pathBuilder.getGameImagePath(imageName);
  }

  getAllTags(): string[] {
    const tagsSet = new Set<string>();
    this.games().forEach(g => g.tags?.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet);
  }

  getfilteredGames(): Game[] {
    return this.games().filter(game => {
      if (this.filters.title && !game.title.toLowerCase().includes(this.filters.title.toLowerCase())) {
        return false;
      }

      const selectedTags = Object.keys(this.filters.tags).filter(tag => this.filters.tags[tag]);
      if (selectedTags.length > 0 && !selectedTags.every(tag => game.tags?.includes(tag))) {
        return false;
      }

      if (this.filters.releaseFrom && new Date(game.releaseDate) < new Date(this.filters.releaseFrom)) {
        return false;
      }
      if (this.filters.releaseTo && new Date(game.releaseDate) > new Date(this.filters.releaseTo)) {
        return false;
      }

      return true;
    });
  }
}
