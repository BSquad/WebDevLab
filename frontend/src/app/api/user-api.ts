import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { AnalysisData } from '../../../../shared/models/analysisData';

@Injectable({
    providedIn: 'root',
})
export class UserApi extends BaseApi {
    private userUrl = `${this.apiUrl}/users`;

    async startUserAnalysis(userId: number): Promise<AnalysisData> {
        const url = this.userUrl + '/analysis';
        return await this.request(this.http.post<AnalysisData>(url, { userId }));
    }
}
