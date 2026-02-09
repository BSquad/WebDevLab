import { UserDbAccess } from '../db-access/user-db-access.js';
import { AnalysisData } from '../../../shared/models/analysisData.js';
import { GameDbAccess } from '../db-access/game-db-access.js';
import { GuideDbAccess } from '../db-access/guide-db-access.js';
import { UserProfile } from '../../../shared/models/user.js';

export class UserService {
    private readonly gameDbAccess = new GameDbAccess();
    private readonly guideDbAccess = new GuideDbAccess();
    private readonly userDbAccess = new UserDbAccess();

    createUser = async (name: string, email: string, passwordHash: string) => {
        return await this.userDbAccess.createUser(name, email, passwordHash);
    };

    getUserById = async (id: number) => {
        const user = await this.userDbAccess.getUserById(id);
        if (!user) throw new Error('User not found');
        return user;
    };

    updateUser = async (id: number, name: string, email: string) => {
        return await this.userDbAccess.updateUser(id, name, email);
    };

    deleteUser = async (id: number) => {
        return await this.userDbAccess.deleteUser(id);
    };

    getFullProfile = async (userId: number): Promise<UserProfile> => {
        const [user, games, guides, achievements] = await Promise.all([
            this.userDbAccess.getUserById(userId),
            this.gameDbAccess.getGamesByUserId(userId),
            this.guideDbAccess.getGuidesByUserId(userId),
            this.gameDbAccess.getAchievementsByUserId(userId),
        ]);

        if (!user) throw new Error('User not found');

        return { ...user, games, guides, achievements };
    };

    startUserAnalysis = async (userId: number): Promise<AnalysisData> => {
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        return await this.userDbAccess.startUserAnalysis(userId);
    };
}
