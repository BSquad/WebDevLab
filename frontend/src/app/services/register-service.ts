import { Injectable } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { UserApi } from '../api/user-api';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private userApi: UserApi) {}

  async registerUser(user: User): Promise<boolean> {
    const success: boolean = await this.userApi.register(user);
    return success;
  }
}
