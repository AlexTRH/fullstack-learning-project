/**
 * Presentation: Controllers
 * HTTP request handlers for user operations
 */

import { Response, NextFunction, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { getMeUseCase } from '../../application/use-cases/users/GetMeUseCase.js';
import { getUserByIdUseCase } from '../../application/use-cases/users/GetUserByIdUseCase.js';
import { updateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase.js';
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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdUseCase({ userId: id }, dependencies);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const { name, bio, avatar } = req.body;

    const user = await updateUserUseCase(
      {
        userId: req.userId,
        data: { name, bio, avatar },
      },
      dependencies
    );

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
