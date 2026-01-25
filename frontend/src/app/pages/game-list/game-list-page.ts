import { Component, signal } from '@angular/core';
import { GameApi } from '../../api/game-api';
import { Game } from '../../../../../shared/models/game';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-game-list',
  imports: [],
  templateUrl: './game-list-page.html',
  styleUrl: './game-list-page.scss',
})
export class GameListPage {
games: any = signal<Game[]>([]);

  constructor(private restApi: GameApi, private toastService: ToastService) {  }

  async ngOnInit() {
    try {
      const data = await this.restApi.getGames();
      this.games.set(data);
    } catch (err) {
      this.toastService.showError('Fehler beim Laden: ' + err);
    }
  }
}
