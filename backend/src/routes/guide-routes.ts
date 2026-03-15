import { Router } from 'express';
import { GuideController } from '../controller/guide-controller.js';
import { upload } from '../middleware/upload-middleware.js';

const router = Router();
const guideController = new GuideController();

router.post('/', guideController.createGuide);

router.get('/game/:gameId', guideController.getGuidesByGameId);

router.get('/user/:userId', guideController.getGuidesByUserId);

router.get('/top/:gameId', guideController.getTopGuidesByGameId);

router.post('/:id/rate', guideController.rateGuide);

router.post(
    '/:id/upload',
    upload.single('image'),
    guideController.uploadScreenshot,
);

router.delete('/:id/screenshot', guideController.deleteScreenshot);

router.get('/:id/pdf', guideController.downloadGuidePdf);

router.get('/:id', guideController.getGuideById);

router.put('/:id', guideController.updateGuide);

router.delete('/:id', guideController.deleteGuide);

export { router as guideRouter };
