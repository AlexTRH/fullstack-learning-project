/**
 * Presentation: Middleware
 * Request validation middleware using Zod
 */

import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../../infrastructure/config/errors.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        next(new AppError(`Validation error: ${errors[0].message}`, 400));
      } else {
        next(error);
      }
    }
  };
};
