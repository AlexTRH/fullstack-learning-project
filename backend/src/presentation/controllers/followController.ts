/**
 * Presentation: Controllers
 * HTTP request handlers for follow operations
 */

import { Response, NextFunction, Request } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { followUserUseCase } from '../../application/use-cases/follows/FollowUserUseCase.js';
import { unfollowUserUseCase } from '../../application/use-cases/follows/UnfollowUserUseCase.js';
import { getFollowersUseCase } from '../../application/use-cases/follows/GetFollowersUseCase.js';
import { getFollowingUseCase } from '../../application/use-cases/follows/GetFollowingUseCase.js';
import { dependencies } from '../../infrastructure/dependencies.js';
import { AppError } from '../../infrastructure/config/errors.js';

export const toggleFollow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      throw new AppError('User not authenticated', 401);
    }

    const { id: followingId } = req.params;

    // Check if already following
    const isFollowing = await dependencies.followRepository.exists(
      req.userId,
      followingId
    );

    if (isFollowing) {
      // Unfollow
      const result = await unfollowUserUseCase(
        {
          followerId: req.userId,
          followingId,
        },
        dependencies
      );

      res.json({
        success: true,
        data: { ...result, isFollowing: false },
      });
    } else {
      // Follow
      const result = await followUserUseCase(
        {
          followerId: req.userId,
          followingId,
        },
        dependencies
      );

      res.json({
        success: true,
        data: { ...result, isFollowing: true },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.params;

    const followers = await getFollowersUseCase({ userId }, dependencies);

    res.json({
      success: true,
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId } = req.params;

    const following = await getFollowingUseCase({ userId }, dependencies);

    res.json({
      success: true,
      data: following,
    });
  } catch (error) {
    next(error);
  }
};
