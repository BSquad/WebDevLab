import { Injectable } from '@angular/core';
import { GameApi } from '../api/game-api';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  // ✅ AchievementApi im Constructor injizieren
  constructor(private gameApi: GameApi) {}

  async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
    return await this.gameApi.getAchievementsByGameId(gameId, userId);
  }

  async completeAchievement(
    achievementId: number,
    userId: number,
    gameId: number,
  ): Promise<boolean> {
    return await this.gameApi.completeAchievement(achievementId, userId, gameId);
  }

  async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
    return await this.gameApi.toggleTrackGame(gameId, userId, isTracked);
  }

  async getBestUsersByGameId(gameId: number): Promise<User[]> {
    return await this.gameApi.getBestUsersByGameId(gameId);
  }
}
