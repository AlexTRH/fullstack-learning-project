/**
 * Presentation: Middleware
 * JWT authentication middleware
 */

import { NextFunction, Request, Response } from 'express';
import { TokenService } from '../../domain/interfaces/TokenService.js';
import { AppError } from '../../infrastructure/config/errors.js';
import { dependencies } from '../../infrastructure/dependencies.js';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);
    const tokenService: TokenService = dependencies.tokenService;
    const payload = tokenService.verifyAccessToken(token);

    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Invalid or expired token', 401));
    }
  }
};
