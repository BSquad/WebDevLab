import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { HttpClient } from '@angular/common/http';
import { Guide } from '../../../../shared/models/guide';

@Injectable({
  providedIn: 'root',
})
export class GuideApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async getGuides(gameId: number): Promise<Guide[]> {
    const data = this.http.get<Guide[]>(`${this.apiUrl}/guides/${gameId}`);
    return await firstValueFrom(data);
  }

  async register(guide: Guide): Promise<boolean> {
      try {
        const res = await firstValueFrom(
          this.http.post<{ success: boolean }>(`${this.apiUrl}/create-guide`, guide)
        );
        return res.success;
      } catch (err) {
        return false;
      }
    }
}
