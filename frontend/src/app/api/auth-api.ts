import { Injectable } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { RegisterData } from '../../../../shared/models/register-data';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  async login(name: string, password: string): Promise<User | null> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ user: User }>(`${this.apiUrl}/login`, { name, password })
      );
      return res.user;
    } catch (err) {
      return null;
    }
  }

  async register(registerData: RegisterData): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean }>(`${this.apiUrl}/register`, registerData)
      );
      return res.success;
    } catch (err) {
      return false;
    }
  }
}
