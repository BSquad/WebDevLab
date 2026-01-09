import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Person } from '../models/person'

@Injectable({
  providedIn: 'root',
})
export class RestApi {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  async loadPersonList(): Promise<Person[]> {
    const data = this.http.get<Person[]>(this.apiUrl);
    return await firstValueFrom(data);
  }
}
