import type { Request, Response } from 'express';
import { FavoritesService } from '../services/favorites-service.js';

export class FavoritesController {
    private favoritesService = new FavoritesService();

    getFavorites = async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const favorites = await this.favoritesService.getFavorites(userId);
        res.json(favorites);
    };

    addFavorite = async (req: Request, res: Response) => {
        const { userId, gameId } = req.body;
        await this.favoritesService.addFavorite(userId, gameId);
        res.json(true);
    };

    removeFavorite = async (req: Request, res: Response) => {
        const userId = Number(req.params.userId);
        const gameId = Number(req.params.gameId);
        await this.favoritesService.removeFavorite(userId, gameId);
        res.json(true);
    };
}
