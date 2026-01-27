/**
 * Presentation: Routes
 * User API routes
 */

import { Router } from 'express';
import { getFollowers, getFollowing, toggleFollow } from '../controllers/followController.js';
import { getMe, getUserById, updateUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/user.js';

const router: Router = Router();

// GET /api/users/me - Get authenticated user's profile
router.get('/me', authenticate, getMe);

// PUT /api/users/me - Update authenticated user's profile
router.put('/me', authenticate, validate(updateUserSchema), updateUser);

// GET /api/users/:id/followers - Get list of followers
router.get('/:id/followers', getFollowers);

// GET /api/users/:id/following - Get list of following
router.get('/:id/following', getFollowing);

// POST /api/users/:id/follow - Toggle follow/unfollow
router.post('/:id/follow', authenticate, toggleFollow);

// GET /api/users/:id - Get public user profile by ID (must be last to avoid conflicts)
router.get('/:id', getUserById);

export default router;
