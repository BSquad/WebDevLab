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

  async login(name: string, password: string) : Promise<User | null> {
    return await firstValueFrom(this.http.post<User | null>(`${this.apiUrl}/login`, { name, password }));
  }

  async register(data: RegisterData) : Promise<boolean> {
    return await firstValueFrom(this.http.post<boolean>(`${this.apiUrl}/register`, data));
  }
}
