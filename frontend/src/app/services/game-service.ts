import { Injectable } from '@angular/core';
import { GameApi } from '../api/game-api';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';

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

  async getAchievementsByGameId(gameId: number, userId?: number) : Promise<Achievement[]> {
    return await this.gameApi.getAchievementsByGameId(gameId, userId);
  }

  async completeAchievement(achievementId: number, userId: number): Promise<boolean> {
    return await this.gameApi.completeAchievement(achievementId, userId);
  }
}
