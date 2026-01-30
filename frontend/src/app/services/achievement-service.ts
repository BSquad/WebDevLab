import { Injectable } from '@angular/core';
import { AchievementApi } from '../api/achievement-api';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';

@Injectable({
    providedIn: 'root',
})
export class AchievementService {
    constructor(private achievementApi: AchievementApi) {}

    async getAchievementsByGameId(gameId: number, userId?: number): Promise<Achievement[]> {
        return await this.achievementApi.getAchievementsByGameId(gameId, userId);
    }

    async completeAchievement(
        achievementId: number,
        userId: number,
        gameId: number,
    ): Promise<boolean> {
        return await this.achievementApi.completeAchievement(achievementId, userId, gameId);
    }

    async toggleTrackGame(gameId: number, userId: number, isTracked: boolean): Promise<boolean> {
        return await this.achievementApi.toggleTrackGame(gameId, userId, isTracked);
    }

    async getBestUsersByGameId(gameId: number): Promise<User[]> {
        return await this.achievementApi.getBestUsersByGameId(gameId);
    }
}
