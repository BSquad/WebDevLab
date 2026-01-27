import { Injectable } from '@angular/core';
import { Game } from '../../../../shared/models/game';
import { BaseApi } from './base-api';
import { Achievement } from '../../../../shared/models/achievement';

@Injectable({
  providedIn: 'root',
})
export class GameApi extends BaseApi {
  async getGames(): Promise<Game[]> {
    return await this.request(this.http.get<Game[]>(`${this.apiUrl}/games`));
  }

  async getGame(id: number): Promise<Game> {
    return await this.request(this.http.get<Game>(`${this.apiUrl}/games/${id}`));
  }

  async getAchievementsByGameId(gameId: number): Promise<Achievement[]> {
    return await this.request(this.http.get<Achievement[]>(`${this.apiUrl}/games/${gameId}/achievements`));
  }

  async getAchievementsByGameIdForUser(gameId: number, userId: number): Promise<Achievement[]> {
    return await this.request(this.http.get<Achievement[]>(`${this.apiUrl}/games/${gameId}/achievements/user/${userId}`));
  }

  async completeAchievement(achievementId: number, userId: number): Promise<boolean> {
    return await this.request(this.http.post<boolean>(`${this.apiUrl}/achievements/${achievementId}/complete`, { userId }));
  }
}
