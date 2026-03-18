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
        return await this.userDbAccess.getUserById(id);
    };

    updateUser = async (
        id: number,
        name: string,
        email: string,
        profilePicturePath: string,
    ) => {
        return await this.userDbAccess.updateUser(
            id,
            name,
            email,
            profilePicturePath,
        );
    };

    updateLayout = async (id: number, order: string[]) => {
        return await this.userDbAccess.updateLayout(id, order);
    };

    deleteUser = async (id: number) => {
        return await this.userDbAccess.deleteUser(id);
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

    startUserAnalysis = async (userId: number): Promise<AnalysisData> => {
        return await this.userDbAccess.startUserAnalysis(userId);
    };
}
