import { Injectable } from '@angular/core';
import { Guide } from '../../../../shared/models/guide';
import { BaseApi } from './base-api';

@Injectable({
  providedIn: 'root',
})
export class GuideApi extends BaseApi {
  async getGuidesByGameId(gameId: number): Promise<Guide[]> {
    return await this.request(this.http.get<Guide[]>(`${this.apiUrl}/guides/game/${gameId}`));
  }

  async createGuide(guide: Guide): Promise<boolean> {
    return await this.request(this.http.post<boolean>(`${this.apiUrl}/guides`, guide));
  }
}
