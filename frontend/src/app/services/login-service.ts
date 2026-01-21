import { Injectable } from '@angular/core';
import { AuthApi } from '../api/auth-api';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userApi: AuthApi) { }

  async loginWithCredentials(username: string, passwordHash: string): Promise<boolean> {
    const success: boolean = await this.userApi.login(username, passwordHash);
    return success;
  }
}
