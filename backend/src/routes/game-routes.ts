import { Router } from 'express';
import { GameController } from '../controller/game-controller.js';

const router = Router();
const gameController = new GameController();

router.get('/popular', gameController.getPopularGames);
router.get('/', gameController.getGames);
router.get('/:gameId', gameController.getGameById);

router.get('/:gameId/achievements', gameController.getAchievementsByGameId);
router.post(
    '/:gameId/achievements/:achievementId/complete',
    gameController.completeAchievement,
);
router.post('/:gameId/track', gameController.toggleTrackGame);
router.get('/:gameId/best-users', gameController.getBestUsersByGameId);

export { router as gameRouter };
