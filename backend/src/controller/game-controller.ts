import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.js';
import createError from 'http-errors';

export class GameController {
    private gameService = new GameService();

    private parseId(value: any, name: string): number {
        const id = Number(value);
        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }
        return id;
    }

    private parseOptionalId(value: any, name: string): number | undefined {
        if (value === undefined) return undefined;

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
        const gameId = this.parseId(req.params.gameId, 'gameId');
        const userId = this.parseOptionalId(req.query.userId, 'userId');

        const game = await this.gameService.getGameById(gameId, userId);
        res.status(200).json(game);
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
    };

    toggleTrackGame = async (req: Request, res: Response): Promise<void> => {
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
