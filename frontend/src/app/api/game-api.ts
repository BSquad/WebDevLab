import { Injectable } from '@angular/core';
import { Game } from '../../../../shared/models/game';
import { BaseApi } from './base-api';

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
}
