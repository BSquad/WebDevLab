import { Injectable } from '@angular/core';
import { Game } from '../../../../shared/models/game';
import { BaseApi } from './base-api';
import { Achievement } from '../../../../shared/models/achievement';

@Injectable({
  providedIn: 'root',
})
export class GameApi extends BaseApi {
  async getGames(userId?: number): Promise<Game[]> {
    return await this.request(this.http.get<Game[]>(`${this.apiUrl}/games${userId ? `/user/${userId}` : ''}`));
  }

  async getGame(id: number, userId?: number): Promise<Game> {
    return await this.request(this.http.get<Game>(`${this.apiUrl}/games/${id}${userId ? `/user/${userId}` : ''}`));
  }

  async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
    return await this.request(this.http.get<Achievement[]>(`${this.apiUrl}/games/${gameId}/achievements${userId ? `/user/${userId}` : ''}`));
  }

  async completeAchievement(achievementId: number, userId: number): Promise<boolean> {
    return await this.request(this.http.post<boolean>(`${this.apiUrl}/achievements/${achievementId}/complete`, { userId }));
  }

  async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
    return await this.request(this.http.post<boolean>(`${this.apiUrl}/games/${gameId}/track`, { userId, isTracked }));
  }
}
