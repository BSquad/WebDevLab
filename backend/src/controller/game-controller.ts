import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.js';
import createError from 'http-errors';

export class GameController {
    private gameService = new GameService();

    /**parse mandatory id or throw error
     *
     * @param value
     * @param name
     * @returns id as number
     */

    private parseId(value: any, name: string): number {
        const id = Number(value);
        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }
        return id;
    }
    /**parse optional id or throw error
     *
     * @param value
     * @param name
     * @returns id as number
     */
    private parseOptionalId(value: any, name: string): number | undefined {
        if (value == null) return undefined;

        const id = Number(value);
        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }
        return id;
    }

    getGames = async (req: Request, res: Response): Promise<void> => {
        const userId = this.parseOptionalId(req.query.userId, 'userId');

        const games = await this.gameService.getAllGames(userId);
        res.status(200).json(games);
    };

    getGameById = async (req: Request, res: Response): Promise<void> => {
        try {
            const gameId = this.parseId(req.params.gameId, 'gameId');
            const userId = this.parseOptionalId(req.query.userId, 'userId');

            const game = await this.gameService.getGameById(gameId, userId);
            if (!game) throw createError(404, 'Game not found');

            res.status(200).json(game);
        } catch (err: any) {
            if (err.status) throw err;
            throw createError(404, 'Game not found');
        }
    };

    getPopularGames = async (_req: Request, res: Response): Promise<void> => {
        const games = await this.gameService.getPopularGames();
        res.status(200).json(games);
    };

    getAchievementsByGameId = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const gameId = this.parseId(req.params.gameId, 'gameId');
        const userId = this.parseOptionalId(req.query.userId, 'userId');

        const achievements = await this.gameService.getAchievementsByGameId(
            gameId,
            userId,
        );

        res.status(200).json(achievements);
    };

    completeAchievement = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        try {
            const gameId = this.parseId(req.params.gameId, 'gameId');
            const achievementId = this.parseId(
                req.params.achievementId,
                'achievementId',
            );
            const userId = this.parseId(req.query.userId, 'userId');

            await this.gameService.completeAchievement(
                achievementId,
                userId,
                gameId,
            );

            res.status(200).json({ message: 'Achievement completed' });
        } catch (err: any) {
            if (err.message === 'ALREADY_COMPLETED') {
                throw createError(409, 'Achievement already completed');
            }

            if (err.message === 'REFERENCE_NOT_FOUND') {
                throw createError(404, 'Resource not found');
            }

            throw err;
        }
    };

    toggleTrackGame = async (req: Request, res: Response): Promise<void> => {
        try {
            const gameId = this.parseId(req.params.gameId, 'gameId');
            const userId = this.parseId(req.query.userId, 'userId');

            if (typeof req.body.isTracked !== 'boolean') {
                throw createError(400, 'isTracked must be a boolean');
            }

            await this.gameService.toggleTrackGame(
                gameId,
                userId,
                req.body.isTracked,
            );

            res.status(200).json({ message: 'Track status updated' });
        } catch (err: any) {
            if (err.message === 'REFERENCE_NOT_FOUND') {
                throw createError(404, 'Game or User not found');
            }

            throw err;
        }
    };

    getBestUsersByGameId = async (
        req: Request,
        res: Response,
    ): Promise<void> => {
        const gameId = this.parseId(req.params.gameId, 'gameId');

        const bestUsers = await this.gameService.getBestUsersByGameId(gameId);

        res.status(200).json(bestUsers);
    };
}
