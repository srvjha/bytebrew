import { Router } from 'express';
import { upload } from '../middleware/multer.middleware';
import { citizenReporting } from '../controllers/report.controller';

const router = Router();

const uploadMiddleware = upload.fields([
  { name: 'photos', maxCount: 4 },
  { name: 'videos', maxCount: 2 },
]);

router.post('/submit-report', uploadMiddleware, citizenReporting);

export default router;
