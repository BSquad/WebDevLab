import { Injectable } from '@angular/core';
import { UserApi } from '../api/user-api';
import { AnalysisData } from '../../../../shared/models/analysisData';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private userApi: UserApi) {}

    async startUserAnalysis(userId: number): Promise<AnalysisData> {
        return this.userApi.startUserAnalysis(userId);
    }
}
