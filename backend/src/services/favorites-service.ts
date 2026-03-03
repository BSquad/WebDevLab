import { FavoritesDbAccess } from '../db-access/favorites-db-access.js';

export class FavoritesService {
    private favoritesDbAccess = new FavoritesDbAccess();

    getFavorites = async (userId: number) => {
        return await this.favoritesDbAccess.getFavoritesByUserId(userId);
    };

    addFavorite = async (userId: number, gameId: number) => {
        await this.favoritesDbAccess.addFavorite(userId, gameId);
    };

    removeFavorite = async (userId: number, gameId: number) => {
        await this.favoritesDbAccess.removeFavorite(userId, gameId);
    };
}
