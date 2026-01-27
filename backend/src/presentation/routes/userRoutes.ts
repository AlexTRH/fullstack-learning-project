/**
 * Presentation: Routes
 * User API routes
 */

import { Router } from 'express';
import { getMe, getUserById, updateUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/user.js';

const router: Router = Router();

// GET /api/users/me - Get authenticated user's profile
router.get('/me', authenticate, getMe);

// PUT /api/users/me - Update authenticated user's profile
router.put('/me', authenticate, validate(updateUserSchema), updateUser);

// GET /api/users/:id - Get public user profile by ID
router.get('/:id', getUserById);

export default router;
