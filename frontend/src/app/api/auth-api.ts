import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { User } from '../../../../shared/models/user';
import { RegisterData } from '../../../../shared/models/register-data';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends BaseApi {
  private authUrl = `${this.apiUrl}/auth`;

  async login(name: string, password: string): Promise<User | null> {
    console.log('Login URL:', `${this.authUrl}/login`);
    return await this.request(
      this.http.post<User | null>(`${this.authUrl}/login`, { name, password }),
    );
  }

  async register(data: RegisterData): Promise<boolean> {
    console.log('Register URL:', `${this.authUrl}/register`);
    return await this.request(this.http.post<boolean>(`${this.authUrl}/register`, data));
  }
}
