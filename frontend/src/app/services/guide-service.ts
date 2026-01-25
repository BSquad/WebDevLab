import { Injectable } from '@angular/core';
import { GuideApi } from '../api/guide-api';
import { Guide } from '../../../../shared/models/guide';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  constructor(private guideApi: GuideApi) { }

  async getGuides(gameId: number): Promise<Guide[]> {
    return await this.guideApi.getGuides(gameId);
  }

  async createGuide(guide: Guide): Promise<boolean> {
    return await this.guideApi.createGuide(guide);
  }
}
