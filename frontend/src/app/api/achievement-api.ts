import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';

@Injectable({
    providedIn: 'root',
})
export class AchievementApi extends BaseApi {
    private achievementsUrl = `${this.apiUrl}/games`;

    async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
        return await this.request(
            this.http.get<Achievement[]>(
                `${this.achievementsUrl}/${gameId}/achievements${userId ? `/user/${userId}` : ''}`,
            ),
        );
    }

    async completeAchievement(
        achievementId: number,
        userId: number,
        gameId: number,
    ): Promise<boolean> {
        return await this.request(
            this.http.post<boolean>(
                `${this.achievementsUrl}/achievements/${achievementId}/complete`,
                { userId, gameId },
            ),
        );
    }

    async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
        return await this.request(
            this.http.post<boolean>(`${this.achievementsUrl}/${gameId}/track`, {
                userId,
                isTracked,
            }),
        );
    }

    async getBestUsersByGameId(gameId: number): Promise<User[]> {
        return await this.request(
            this.http.get<User[]>(`${this.achievementsUrl}/${gameId}/best-users`),
        );
    }
}
