import { Router } from 'express';
import { getMe } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Шаг 1: GET /api/users/me - получить свой профиль
// Требует аутентификации (middleware authenticate)
router.get('/me', authenticate, getMe);

export default router;
