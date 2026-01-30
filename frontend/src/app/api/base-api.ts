import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BaseApi {
  protected apiUrl = 'http://localhost:3000';

  constructor(protected http: HttpClient) {}

  async request<T>(obs: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(obs);
    } catch (err: any) {
      throw err?.error ?? err;
    }
  }
}
