import { Injectable } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { RegisterData } from '../../../../shared/models/register-data';
import { BaseApi } from './base-api';

@Injectable({
  providedIn: 'root',
})
export class AuthApi extends BaseApi {
  async login(name: string, password: string) : Promise<User | null> {
    return await this.request(this.http.post<User | null>(`${this.apiUrl}/login`, { name, password }));
  }

  async register(data: RegisterData) : Promise<boolean> {
    return await this.request(this.http.post<boolean>(`${this.apiUrl}/register`, data));
  }
}
