/**
 * Application: Use Case
 * Follow a user
 */

import { FollowRepository } from '@domain/interfaces/FollowRepository';
import { UserRepository } from '@domain/interfaces/UserRepository';
import { AppError } from '@infrastructure/config/errors';

export interface FollowUserUseCaseInput {
  followerId: string;
  followingId: string;
}

export async function followUserUseCase(
  input: FollowUserUseCaseInput,
  dependencies: {
    followRepository: FollowRepository;
    userRepository: UserRepository;
  }
): Promise<{ success: boolean; message: string }> {
  const { followRepository, userRepository } = dependencies;

  // Check if trying to follow yourself
  if (input.followerId === input.followingId) {
    throw new AppError('Cannot follow yourself', 400);
  }

  // Check if target user exists
  const targetUser = await userRepository.findById(input.followingId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  // Check if already following
  const alreadyFollowing = await followRepository.exists(
    input.followerId,
    input.followingId
  );

  if (alreadyFollowing) {
    throw new AppError('Already following this user', 409);
  }

  // Create follow relationship
  await followRepository.create({
    followerId: input.followerId,
    followingId: input.followingId,
  });

  return { success: true, message: 'Successfully followed user' };
}
