import { Router } from 'express';
import { CommentsController } from '../controller/comments-controller.js';

const router = Router();
const commentsController = new CommentsController();

router.post('/', commentsController.addComment);
router.get('/:guideId', commentsController.getComments);

export { router as commentsRouter };
