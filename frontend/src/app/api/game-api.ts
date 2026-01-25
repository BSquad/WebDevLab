import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Game } from '../../../../shared/models/game';

@Injectable({
  providedIn: 'root',
})
export class GameApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async getGames(): Promise<Game[]> {
    return await firstValueFrom(this.http.get<Game[]>(`${this.apiUrl}/games`));
  }

  async getGame(id: number): Promise<Game> {
    return await firstValueFrom(this.http.get<Game>(`${this.apiUrl}/games/${id}`));
  }
}
