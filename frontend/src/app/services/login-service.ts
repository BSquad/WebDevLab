import { Injectable } from '@angular/core';
import { UserApi } from '../api/user-api';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userApi: UserApi) { }

  async loginWithCredentials(username: string, passwordHash: string): Promise<boolean> {
    const success: boolean = await this.userApi.login(username, passwordHash);
    return success;
  }
}
