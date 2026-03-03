import { Router } from 'express';
import { FavoritesController } from '../controller/favorites-controller.js';

const router = Router();
const favoritesController = new FavoritesController();

router.get('/:userId', favoritesController.getFavorites);
router.post('/', favoritesController.addFavorite);
router.delete('/:userId/:gameId', favoritesController.removeFavorite);

export { router as favoritesRouter };
