import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { HttpClient } from '@angular/common/http';
import { Guide } from '../../../../shared/models/guide';

@Injectable({
  providedIn: 'root',
})
export class GuideApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  async getGuides(gameId: number): Promise<Guide[]> {
    return await firstValueFrom(this.http.get<Guide[]>(`${this.apiUrl}/guides/${gameId}`));
  }

  async createGuide(guide: Guide): Promise<boolean> {
    return await firstValueFrom(this.http.post<boolean>(`${this.apiUrl}/create-guide`, guide));
  }
}
