import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserApi } from '../api/user-api';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private userApi: UserApi) {}

  async canUserRegister(user: User): Promise<boolean> {
    const users: User[] = await this.userApi.getUsers();
    const emailExists = users.some(u => u.email === user.email);
    return !emailExists;
  }

  async registerUser(user: User) {
    await this.userApi.addUser(user);
  }
}
