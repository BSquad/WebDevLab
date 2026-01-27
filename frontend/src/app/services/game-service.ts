import { Injectable } from '@angular/core';
import { GameApi } from '../api/game-api';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private gameApi: GameApi) {}
  
  async getGames(userId?: number) : Promise<Game[]> {
    return await this.gameApi.getGames(userId);
  }

  async getGame(id: number, userId?: number) : Promise<Game> {
    return await this.gameApi.getGame(id, userId);
  }

  async getAchievementsByGameId(gameId: number, userId?: number) : Promise<Achievement[]> {
    return await this.gameApi.getAchievementsByGameId(gameId, userId);
  }

  async completeAchievement(achievementId: number, userId: number): Promise<boolean> {
    return await this.gameApi.completeAchievement(achievementId, userId);
  }

  async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
    return await this.gameApi.toggleTrackGame(gameId, userId, isTracked);
  }
}
