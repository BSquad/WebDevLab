import { Router } from 'express';
import { UserController } from '../controller/user-controller.js';

const router = Router();
const userController = new UserController();

router.get('/:id/profile', userController.getUserProfile);
router.post('/analysis', userController.startUserAnalysis);

router.get('/:id/games', userController.getGames);
router.get('/:id/achievements', userController.getAchievements);
router.get('/:id/guides', userController.getGuides);

// CRUD ohne C
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export { router as userRouter };
