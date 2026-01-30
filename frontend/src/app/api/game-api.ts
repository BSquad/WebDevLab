import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class GameApi extends BaseApi {
  private gameUrl = `${this.apiUrl}/games`;

  // --------- Game ---------
  async getGames(userId?: number): Promise<Game[]> {
    const url = userId ? `${this.gameUrl}?userId=${userId}` : this.gameUrl;
    return await this.request(this.http.get<Game[]>(url));
  }

  async getGame(id: number, userId?: number): Promise<Game> {
    const url = userId ? `${this.gameUrl}/${id}?userId=${userId}` : `${this.gameUrl}/${id}`;
    return await this.request(this.http.get<Game>(url));
  }

  async getPopularGames(): Promise<Game[]> {
    return await this.request(this.http.get<Game[]>(`${this.gameUrl}/popular`));
  }

  // --------- Achievement ---------
  async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
    const url = `${this.gameUrl}/${gameId}/achievements${userId ? `?userId=${userId}` : ''}`;
    return await this.request(this.http.get<Achievement[]>(url));
  }

  async completeAchievement(
    achievementId: number,
    userId: number,
    gameId: number,
  ): Promise<boolean> {
    const url = `${this.gameUrl}/${gameId}/achievements/${achievementId}/complete?userId=${userId}`;
    return await this.request(this.http.post<boolean>(url, {}));
  }

  async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
    const url = `${this.gameUrl}/${gameId}/track?userId=${userId}`;
    return await this.request(this.http.post<boolean>(url, { isTracked }));
  }

  async getBestUsersByGameId(gameId: number): Promise<User[]> {
    return await this.request(this.http.get<User[]>(`${this.gameUrl}/${gameId}/best-users`));
  }
}
