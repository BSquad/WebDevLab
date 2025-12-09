import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  validateCredentials(username: string, password: string): boolean {
    // TODO
    return username === 'sa' && password === 'sa';
  }
}
