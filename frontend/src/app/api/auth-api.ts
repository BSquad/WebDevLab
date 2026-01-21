import { Injectable } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  async login(name: string, passwordHash: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiUrl}/login`, { name, passwordHash })
      );
      return res.success;
    } catch (err) {
      return false;
    }
  }

  async registerUser(user: User): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiUrl}/register`, user)
      );
      return res.success;
    } catch (err) {
      return false;
    }
  }
}
