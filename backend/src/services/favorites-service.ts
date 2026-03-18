import { FavoritesDbAccess } from '../db-access/favorites-db-access.js';
import createError from 'http-errors';

export class FavoritesService {
    private favoritesDbAccess = new FavoritesDbAccess();

    getFavorites = async (userId: number) => {
        return this.favoritesDbAccess.getFavoritesByUserId(userId);
    };

    addFavorite = async (userId: number, gameId: number): Promise<void> => {
        try {
            await this.favoritesDbAccess.addFavorite(userId, gameId);
        } catch (err: any) {
            if (err.message?.includes('SQLITE_CONSTRAINT')) {
                throw createError(400, 'Favorite already exists');
            }
            throw err;
        }
    };

    removeFavorite = async (userId: number, gameId: number): Promise<void> => {
        await this.favoritesDbAccess.removeFavorite(userId, gameId);
    };
}
