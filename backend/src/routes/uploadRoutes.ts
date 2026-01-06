import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { uploadSingle } from '../utils/upload';
import { authenticate } from '../middleware/auth';

const router = Router();

// Загрузка изображения (требует аутентификации)
router.post('/', authenticate, uploadSingle, uploadImage);

export default router;

