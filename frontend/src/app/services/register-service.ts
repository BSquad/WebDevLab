import { Injectable } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { AuthApi } from '../api/auth-api';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private authApi: AuthApi) {}

  async registerUser(user: User): Promise<boolean> {
    const success: boolean = await this.authApi.registerUser(user);
    return success;
  }
}
