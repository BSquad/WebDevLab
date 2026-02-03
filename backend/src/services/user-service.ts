import { UserDbAccess } from '../db-access/user-db-access.js';
import { AnalysisData } from '../../../shared/models/analysisData.js';

export class UserService {
    private userDbAccess: UserDbAccess = new UserDbAccess();

    startUserAnalysis = async (userId: number): Promise<AnalysisData> => {
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        return await this.userDbAccess.startUserAnalysis(userId);
    };
}
