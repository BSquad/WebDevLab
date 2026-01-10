import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  async login(name: string, password: string): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiUrl}/login`, { name, password })
      );
      return res.success;
    } catch (err) {
      return false;
    }
  }

  async register(user: User): Promise<boolean> {
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
