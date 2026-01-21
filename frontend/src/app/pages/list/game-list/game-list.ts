import { Component, signal } from '@angular/core';
import { GameApi } from '../../../api/game-api';
import { Game } from '../../../../../../shared/models/game';

@Component({
  selector: 'app-game-list',
  imports: [],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
})
export class GameList {
games: any = signal<Game[]>([]);

  constructor(private restApi: GameApi) {  }

  async ngOnInit() {
    try {
      const data = await this.restApi.getGames();
      this.games.set(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    }
  }
}
