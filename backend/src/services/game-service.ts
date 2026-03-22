import type { Achievement } from '../../../shared/models/achievement.ts';
import type { Game } from '../../../shared/models/game.ts';
import { User } from '../../../shared/models/user.js';
import { GameDbAccess } from '../db-access/game-db-access.js';

export class GameService {
    private gameDbAccess: GameDbAccess = new GameDbAccess();

    getAllGames = async (userId?: number): Promise<Game[]> => {
        return this.gameDbAccess.getGames(userId);
    };

    getGameById = async (
        gameId: number,
        userId?: number,
    ): Promise<Game | null> => {
        const game = await this.gameDbAccess.getGameById(gameId, userId);

        return game || null;
    };

    getAchievementsByGameId = async (
        gameId: number,
        userId?: number,
    ): Promise<Achievement[]> => {
        return this.gameDbAccess.getAchievementsByGameId(gameId, userId);
    };

    completeAchievement = async (
        achievementId: number,
        userId: number,
        gameId: number,
    ) => {
        try {
            await this.gameDbAccess.completeAchievement(
                achievementId,
                userId,
                gameId,
            );
        } catch (err: any) {
            if (err.message?.includes('UNIQUE constraint failed')) {
                throw new Error('ALREADY_COMPLETED');
            }
            if (err.message?.includes('FOREIGN KEY constraint failed')) {
                throw new Error('REFERENCE_NOT_FOUND');
            }
            throw err;
        }
    };

    toggleTrackGame = async (
        gameId: number,
        userId: number,
        isTracked: boolean,
    ) => {
        try {
            if (isTracked) {
                await this.gameDbAccess.unTrackGame(gameId, userId);
            } else {
                await this.gameDbAccess.trackGame(gameId, userId);
            }
        } catch (err: any) {
            if (err.message?.includes('FOREIGN KEY constraint failed')) {
                throw new Error('REFERENCE_NOT_FOUND');
            }
            throw err;
        }
    };

    getBestUsersByGameId = async (gameId: number): Promise<User[]> => {
        return this.gameDbAccess.getBestUsersByGameId(gameId);
    };

    getPopularGames = async (): Promise<Game[]> => {
        return this.gameDbAccess.getPopularGames();
    };

    getGamesByUserId = async (id: number): Promise<Game[]> => {
        return this.gameDbAccess.getGamesByUserId(id);
    };

    getAchievementsByUserId = async (id: number): Promise<Achievement[]> => {
        return this.gameDbAccess.getAchievementsByUserId(id);
    };
}
