/**
 * Presentation: Validators
 * Zod schemas for validating user-related request bodies
 */

import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').max(100, 'Name is too long').optional(),
    bio: z.string().max(500, 'Bio is too long').optional(),
    avatar: z.string().url('Avatar must be a valid URL').optional(),
  }),
});
