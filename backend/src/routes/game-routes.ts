import { Router } from 'express';
import { GameController } from '../controller/game-controller.js';

const router = Router();
const gameController = new GameController();

router.get('/popular', gameController.getPopularGames);
router.get('/', gameController.getGames); // optional userId als Query-Parameter
router.get('/:gameId', gameController.getGameById); // optional userId als Query-Parameter

router.get('/:gameId/achievements', gameController.getAchievementsByGameId); // ?userId=...
router.post(
    '/:gameId/achievements/:achievementId/complete',
    gameController.completeAchievement,
); // ?userId=...
router.post('/:gameId/track', gameController.toggleTrackGame); // ?userId=...
router.get('/:gameId/best-users', gameController.getBestUsersByGameId);

export { router as gameRouter };
