import { UserDbAccess } from '../db-access/user-db-access.js';
import { AnalysisData } from '../../../shared/models/analysisData.js';
import { GameDbAccess } from '../db-access/game-db-access.js';
import { GuideDbAccess } from '../db-access/guide-db-access.js';
import { UserProfile, UserSummary } from '../../../shared/models/user.js';

export class UserService {
    private readonly gameDbAccess = new GameDbAccess();
    private readonly guideDbAccess = new GuideDbAccess();
    private readonly userDbAccess = new UserDbAccess();

    createUser = async (name: string, email: string, passwordHash: string) => {
        return await this.userDbAccess.createUser(name, email, passwordHash);
    };

    getUserById = async (id: number) => {
        return (await this.userDbAccess.getUserById(id)) || null;
    };

    updateUser = async (
        id: number,
        name: string,
        email: string,
        profilePicturePath: string,
    ) => {
        await this.userDbAccess.updateUser(id, name, email, profilePicturePath);
        return (await this.userDbAccess.getUserById(id)) || null;
    };

    updateLayout = async (id: number, order: string[]) => {
        await this.userDbAccess.updateLayout(id, order);
        return true;
    };

    deleteUser = async (id: number) => {
        await this.userDbAccess.deleteUser(id);
        return true;
    };

    getFullProfile = async (userId: number): Promise<UserProfile | null> => {
        const [user, games, guides, achievements] = await Promise.all([
            this.userDbAccess.getUserById(userId),
            this.gameDbAccess.getGamesByUserId(userId),
            this.guideDbAccess.getGuidesByUserId(userId),
            this.gameDbAccess.getAchievementsByUserId(userId),
        ]);

        if (!user) return null;

        return { ...user, games, guides, achievements };
    };

    getUserSummary = async (userId: number): Promise<UserSummary | null> => {
        return await this.userDbAccess.getUserSummary(userId);
    };

    startUserAnalysis = async (
        userId: number,
    ): Promise<AnalysisData | null> => {
        const result = await this.userDbAccess.startUserAnalysis(userId);
        return result || null;
    };
}
