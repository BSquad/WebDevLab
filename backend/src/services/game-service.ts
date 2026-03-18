import type { Achievement } from '../../../shared/models/achievement.ts';
import type { Game } from '../../../shared/models/game.ts';
import { User } from '../../../shared/models/user.js';
import { GameDbAccess } from '../db-access/game-db-access.js';
import createError from 'http-errors';

export class GameService {
    private gameDbAccess: GameDbAccess = new GameDbAccess();

    getAllGames = async (userId?: number): Promise<Game[]> => {
        return this.gameDbAccess.getGames(userId);
    };

    getGameById = async (gameId: number, userId?: number): Promise<Game> => {
        const game = await this.gameDbAccess.getGameById(gameId, userId);

        if (!game) {
            throw createError(404, 'Game not found');
        }

        return game;
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
        await this.gameDbAccess.completeAchievement(
            achievementId,
            userId,
            gameId,
        );
    };

    toggleTrackGame = async (
        gameId: number,
        userId: number,
        isTracked: boolean,
    ) => {
        if (isTracked) {
            await this.gameDbAccess.unTrackGame(gameId, userId);
        } else {
            await this.gameDbAccess.trackGame(gameId, userId);
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
