import { UserDbAccess } from '../db-access/user-db-access.js';
import { AnalysisData } from '../../../shared/models/analysisData.js';
import { GameDbAccess } from '../db-access/game-db-access.js';
import { GuideDbAccess } from '../db-access/guide-db-access.js';
import { UserProfile } from '../../../shared/models/user.js';
import createError from 'http-errors';

export class UserService {
    private readonly gameDbAccess = new GameDbAccess();
    private readonly guideDbAccess = new GuideDbAccess();
    private readonly userDbAccess = new UserDbAccess();

    createUser = async (name: string, email: string, passwordHash: string) => {
        return this.userDbAccess.createUser(name, email, passwordHash);
    };

    getUserById = async (id: number) => {
        const user = await this.userDbAccess.getUserById(id);
        if (!user) throw createError(404, 'User not found');
        return user;
    };

    updateUser = async (
        id: number,
        name: string,
        email: string,
        profilePicturePath: string,
    ) => {
        // ❗ kein Truthiness-Check auf void
        await this.userDbAccess.updateUser(id, name, email, profilePicturePath);

        // optional: Existenz prüfen (wenn DB nichts zurückgibt)
        const user = await this.userDbAccess.getUserById(id);
        if (!user) throw createError(404, 'User not found');

        return user;
    };

    updateLayout = async (id: number, order: string[]) => {
        await this.userDbAccess.updateLayout(id, order);

        const user = await this.userDbAccess.getUserById(id);
        if (!user) throw createError(404, 'User not found');

        return true;
    };

    deleteUser = async (id: number) => {
        await this.userDbAccess.deleteUser(id);

        // prüfen ob User noch existiert
        const user = await this.userDbAccess.getUserById(id);
        if (user) {
            throw createError(500, 'Failed to delete user');
        }

        return true;
    };

    getFullProfile = async (userId: number): Promise<UserProfile> => {
        const [user, games, guides, achievements] = await Promise.all([
            this.userDbAccess.getUserById(userId),
            this.gameDbAccess.getGamesByUserId(userId),
            this.guideDbAccess.getGuidesByUserId(userId),
            this.gameDbAccess.getAchievementsByUserId(userId),
        ]);

        if (!user) throw createError(404, 'User not found');

        return { ...user, games, guides, achievements };
    };

    startUserAnalysis = async (userId: number): Promise<AnalysisData> => {
        const result = await this.userDbAccess.startUserAnalysis(userId);

        if (!result) {
            throw createError(500, 'User analysis failed');
        }

        return result;
    };
}
