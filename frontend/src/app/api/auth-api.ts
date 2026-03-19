import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { User } from '../../../../shared/models/user';
import { RegisterData } from '../../../../shared/models/register-data';
import { ToastService } from '../services/toast-service';

@Injectable({
    providedIn: 'root',
})
export class AuthApi extends BaseApi {
    private authUrl = `${this.apiUrl}/auth`;

    constructor(http: HttpClient, toast: ToastService) {
        super(http, toast);
    }
    async login(name: string, password: string): Promise<User | null> {
        return await this.request(
            this.http.post<User | null>(`${this.authUrl}/login`, { name, password }),
            { showError: false },
        );
    }

    async register(data: RegisterData): Promise<boolean> {
        await this.request(this.http.post<{ message: string }>(`${this.authUrl}/register`, data));

        return true;
    }
}
