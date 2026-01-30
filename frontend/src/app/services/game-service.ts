import { Injectable } from '@angular/core';
import { GameApi } from '../api/game-api';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private gameApi: GameApi) {}

  async getGames(userId?: number): Promise<Game[]> {
    return this.gameApi.getGames(userId);
  }

  async getGame(id: number, userId?: number): Promise<Game> {
    return this.gameApi.getGame(id, userId);
  }

  async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
    return this.gameApi.getAchievementsByGameId(gameId, userId);
  }

  async completeAchievement(
    achievementId: number,
    userId: number,
    gameId: number,
  ): Promise<boolean> {
    return this.gameApi.completeAchievement(achievementId, userId, gameId);
  }

  async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
    return this.gameApi.toggleTrackGame(gameId, userId, isTracked);
  }

  async getBestUsersByGameId(gameId: number): Promise<User[]> {
    return this.gameApi.getBestUsersByGameId(gameId);
  }

  async getPopularGames(): Promise<Game[]> {
    return this.gameApi.getPopularGames();
  }
}
