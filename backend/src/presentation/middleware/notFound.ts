/**
 * Presentation: Middleware
 * 404 Not Found handler
 */

import { NextFunction, Request, Response } from 'express';

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
