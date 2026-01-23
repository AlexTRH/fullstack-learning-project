/**
 * Presentation: Middleware
 * Global error handler
 */

import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../infrastructure/config/errors.js';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected errors
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
};
