/**
 * Presentation: Controllers
 * HTTP request handlers for user operations
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { getMeUseCase } from '../../application/use-cases/users/GetMeUseCase.js';
import { dependencies } from '../../infrastructure/dependencies.js';
import { AppError } from '../../infrastructure/config/errors.js';

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const user = await getMeUseCase({ userId: req.userId }, dependencies);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
