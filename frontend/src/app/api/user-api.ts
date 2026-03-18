import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { UserProfile } from '../../../../shared/models/user';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';
import { Guide } from '../../../../shared/models/guide';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../services/toast-service';

@Injectable({
    providedIn: 'root',
})
export class UserApi extends BaseApi {
    private userUrl = `${this.apiUrl}/users`;

    constructor(http: HttpClient, toast: ToastService) {
        super(http, toast);
    }

    async getUserProfile(userId: number): Promise<UserProfile> {
        const url = `${this.userUrl}/${userId}/profile`;
        return await this.request(this.http.get<UserProfile>(url));
    }

    async updateUser(userId: number, formData: FormData): Promise<void> {
        const url = `${this.userUrl}/${userId}`;
        return await this.request(this.http.put<void>(url, formData));
    }

    async updateLayout(userId: number, order: string[]): Promise<void> {
        const url = `${this.userUrl}/${userId}/layout`;
        return await this.request(this.http.patch<void>(url, { order }));
    }

    async getGames(userId: number): Promise<Game[]> {
        const url = `${this.userUrl}/${userId}/games`;
        return await this.request(this.http.get<Game[]>(url));
    }

    async getAchievements(userId: number): Promise<Achievement[]> {
        const url = `${this.userUrl}/${userId}/achievements`;
        return await this.request(this.http.get<Achievement[]>(url));
    }

    async getGuides(userId: number): Promise<Guide[]> {
        const url = `${this.userUrl}/${userId}/guides`;
        return await this.request(this.http.get<Guide[]>(url));
    }

    async startUserAnalysis(userId: number): Promise<Response> {
        const res = await fetch(`${this.userUrl}/analysis`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw {
                status: res.status,
                message: errorText || 'Fehler bei Analyse',
            };
        }

        return res;
    }
}
