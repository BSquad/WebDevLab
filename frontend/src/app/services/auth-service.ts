import { Injectable } from '@angular/core';
import { AuthApi } from '../api/auth-api';
import { User } from '../../../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authApi: AuthApi) { }

  async loginWithCredentials(username: string, passwordHash: string): Promise<boolean> {
    const success: boolean = await this.authApi.login(username, passwordHash);
    return success;
  }

  async registerUser(user: User): Promise<boolean> {
      const success: boolean = await this.authApi.registerUser(user);
      return success;
    }
}
