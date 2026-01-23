/**
 * Presentation: Routes
 * Authentication API routes
 */

import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.js';

const router: Router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/logout', authenticate, logout);

export default router;
