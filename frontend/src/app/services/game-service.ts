import { Injectable } from '@angular/core';
import { GameApi } from '../api/game-api';
import { Game } from '../../../../shared/models/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private gameApi: GameApi) {}
  
  async getGames() : Promise<Game[]> {
    return await this.gameApi.getGames();
  }

  async getGame(id: number) : Promise<Game> {
    return await this.gameApi.getGame(id);
  }
}
