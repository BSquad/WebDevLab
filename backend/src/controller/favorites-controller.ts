import type { Request, Response } from 'express';
import { FavoritesService } from '../services/favorites-service.js';
import createError from 'http-errors';

export class FavoritesController {
    private favoritesService = new FavoritesService();

    private parseId(value: any, name: string): number {
        const id = Number(value);
        if (Number.isNaN(id)) {
            throw createError(400, `Invalid ${name}`);
        }
        return id;
    }

    getFavorites = async (req: Request, res: Response): Promise<void> => {
        const userId = this.parseId(req.params.userId, 'userId');

        const favorites = await this.favoritesService.getFavorites(userId);

        res.status(200).json(favorites);
    };

    addFavorite = async (req: Request, res: Response): Promise<void> => {
        const userId = this.parseId(req.body.userId, 'userId');
        const gameId = this.parseId(req.body.gameId, 'gameId');

        await this.favoritesService.addFavorite(userId, gameId);

        res.status(201).json({ message: 'Favorite added successfully' });
    };

    removeFavorite = async (req: Request, res: Response): Promise<void> => {
        const userId = this.parseId(req.params.userId, 'userId');
        const gameId = this.parseId(req.params.gameId, 'gameId');

        await this.favoritesService.removeFavorite(userId, gameId);

        res.status(200).json({ message: 'Favorite removed successfully' });
    };
}
