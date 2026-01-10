import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  async getUsers(): Promise<User[]> {
    const data = this.http.get<User[]>(this.apiUrl);
    return await firstValueFrom(data);
  }

  async getUserByName(name: string): Promise<User> {
    const data = this.http.get<User>(`${this.apiUrl}/${name}`);
    return await firstValueFrom(data);
  }

  async addUser(user: User): Promise<any> {
    const data = this.http.post(this.apiUrl, user);
    return await firstValueFrom(data);
  }
}
