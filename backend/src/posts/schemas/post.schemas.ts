/**
 * Posts module: Zod schemas for request body and query validation (presentation layer).
 */

import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
    attachments: z.array(z.string().url('Invalid attachment URL')).max(10).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content cannot be empty').max(10000, 'Content is too long').optional(),
    attachments: z.array(z.string().url('Invalid attachment URL')).max(10).optional(),
  }),
});

export const listPostsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
    authorId: z.string().uuid().optional(),
  }),
});
