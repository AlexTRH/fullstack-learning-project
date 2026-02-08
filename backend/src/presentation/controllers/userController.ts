/**
 * Presentation: Controllers
 * HTTP request handlers for user operations
 */

import { Response, NextFunction, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { getMeUseCase } from '../../application/use-cases/users/GetMeUseCase.js';
import { getUserByIdUseCase } from '../../application/use-cases/users/GetUserByIdUseCase.js';
import { listUsersUseCase } from '../../application/use-cases/users/ListUsersUseCase.js';
import { updateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase.js';
import { dependencies } from '../../infrastructure/dependencies.js';
import { AppError } from '../../infrastructure/config/errors.js';

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const search = (req.query.search as string)?.trim();

    const result = await listUsersUseCase(
      { page, limit, search: search || undefined },
      dependencies
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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
