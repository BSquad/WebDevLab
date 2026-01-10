import { Injectable } from '@angular/core';
import { UserApi } from '../api/user-api';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private userApi: UserApi) {}

  async validateCredentials(username: string, password: string): Promise<boolean> {
    const user = await this.userApi.getUserByName(username);
    const isValid = user && user.password === password;
    return isValid;
  }
}
