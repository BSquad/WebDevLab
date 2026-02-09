import { Injectable, inject } from '@angular/core';
import { UserApi } from '../api/user-api';
import { AnalysisData } from '../../../../shared/models/analysisData';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userApi = inject(UserApi);

    async getUserProfile(userId: number) {
        return this.userApi.getUserProfile(userId);
    }

    async getGames(userId: number) {
        return this.userApi.getGames(userId);
    }

    async getAchievements(userId: number) {
        return this.userApi.getAchievements(userId);
    }

    async getGuides(userId: number) {
        return this.userApi.getGuides(userId);
    }

    async startUserAnalysis(userId: number): Promise<AnalysisData> {
        return this.userApi.startUserAnalysis(userId);
    }
}
