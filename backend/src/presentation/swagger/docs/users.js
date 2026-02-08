/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List users (find people)
 *     description: Returns a paginated list of users with optional search by username or name. Public, no auth required.
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema: { type: string, maxLength: 100 }
 *         description: Search by username or display name (case-insensitive)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/UserPublic' }
 *                     total: { type: integer, description: Total count matching the query }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *       400: { $ref: '#/components/responses/BadRequest' }
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     description: Returns the full profile of the currently authenticated user including email and counts
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   allOf:
 *                     - { $ref: '#/components/schemas/User' }
 *                     - type: object
 *                       properties:
 *                         _count:
 *                           type: object
 *                           properties:
 *                             posts: { type: number, example: 5 }
 *                             followers: { type: number, example: 10 }
 *                             following: { type: number, example: 8 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *   put:
 *     summary: Update authenticated user's profile
 *     description: Update name, bio, or avatar of the authenticated user
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, minLength: 1, maxLength: 100, example: John Doe }
 *               bio: { type: string, maxLength: 500, example: Software developer passionate about web technologies }
 *               avatar: { type: string, format: uri, example: https://example.com/avatar.jpg }
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/User' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get public user profile by ID
 *     description: Returns public profile information (without email) for any user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/UserPublic' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @swagger
 * /api/users/{id}/followers:
 *   get:
 *     summary: Get user's followers
 *     description: Returns a list of users who follow the specified user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of followers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/UserPublic' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @swagger
 * /api/users/{id}/following:
 *   get:
 *     summary: Get users that a user is following
 *     description: Returns a list of users that the specified user is following
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of following users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/UserPublic' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */

/**
 * @swagger
 * /api/users/{id}/follow:
 *   post:
 *     summary: Toggle follow/unfollow a user
 *     description: Follow or unfollow a user. If already following, unfollows. If not following, follows.
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *         description: User ID to follow/unfollow
 *     responses:
 *       200:
 *         description: Follow status toggled successfully
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FollowResponse' }
 *       400:
 *         description: Cannot follow yourself
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409:
 *         description: Already following this user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
