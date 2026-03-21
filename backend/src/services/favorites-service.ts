import { FavoritesDbAccess } from '../db-access/favorites-db-access.js';

export class FavoritesService {
    private favoritesDbAccess = new FavoritesDbAccess();

    getFavorites = async (userId: number) => {
        return this.favoritesDbAccess.getFavoritesByUserId(userId);
    };

    addFavorite = async (userId: number, gameId: number): Promise<void> => {
        try {
            await this.favoritesDbAccess.addFavorite(userId, gameId);
        } catch (err: any) {
            if (err.message?.includes('UNIQUE')) {
                throw new Error('ALREADY_FAVORITED');
            }
            if (err.message?.includes('FOREIGN KEY')) {
                throw new Error('REFERENCE_NOT_FOUND');
            }
            throw err;
        }
    };
    removeFavorite = async (userId: number, gameId: number): Promise<void> => {
        await this.favoritesDbAccess.removeFavorite(userId, gameId);
    };
}
