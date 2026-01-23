/**
 * Presentation: Controllers
 * HTTP request handlers for authentication
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { registerUseCase } from '../../application/use-cases/auth/RegisterUseCase.js';
import { loginUseCase } from '../../application/use-cases/auth/LoginUseCase.js';
import { refreshTokenUseCase } from '../../application/use-cases/auth/RefreshTokenUseCase.js';
import { logoutUseCase } from '../../application/use-cases/auth/LogoutUseCase.js';
import { dependencies } from '../../infrastructure/dependencies.js';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUseCase(req.body, dependencies);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUseCase(req.body, dependencies);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await refreshTokenUseCase(req.body, dependencies);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await logoutUseCase(req.body, dependencies);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
