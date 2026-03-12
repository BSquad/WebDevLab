import { Router } from 'express';
import { GuideController } from '../controller/guide-controller.js';
import { upload } from '../middleware/upload-middleware.js';

const router = Router();
const guideController = new GuideController();

// MH11 – Create Guide
router.post('/', guideController.createGuide);

// TODO: ggf. später REST-konform zu /games/:gameId/guides verschieben
router.get('/game/:gameId', guideController.getGuidesByGameId);

router.get('/user/:userId', guideController.getGuidesByUserId);

// MH10 – Top 3 Guides
router.get('/top/:gameId', guideController.getTopGuidesByGameId);

// MH13 – Rate Guide
router.post('/:id/rate', guideController.rateGuide);

// MH14 – screenshot upload
router.post(
    '/:id/upload',
    upload.single('image'),
    guideController.uploadScreenshot,
);

// MH15 – PDF Download
router.get('/:id/pdf', guideController.downloadGuidePdf);

// Einzelnen Guide laden
router.get('/:id', guideController.getGuideById);

// MH12 – Update Guide (nur Autor!)
router.put('/:id', guideController.updateGuide);

// MH21 – Delete Guide
router.delete('/:id', guideController.deleteGuide);

export { router as guideRouter };
