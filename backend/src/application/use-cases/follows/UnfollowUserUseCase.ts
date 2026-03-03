/**
 * Application: Use Case
 * Unfollow a user
 */

import { FollowRepository } from '@domain/interfaces/FollowRepository';
import { UserRepository } from '@domain/interfaces/UserRepository';
import { AppError } from '@infrastructure/config/errors';

export interface UnfollowUserUseCaseInput {
  followerId: string;
  followingId: string;
}

export async function unfollowUserUseCase(
  input: UnfollowUserUseCaseInput,
  dependencies: {
    followRepository: FollowRepository;
    userRepository: UserRepository;
  }
): Promise<{ success: boolean; message: string }> {
  const { followRepository, userRepository } = dependencies;

  // Check if target user exists
  const targetUser = await userRepository.findById(input.followingId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }

  // Check if following
  const isFollowing = await followRepository.exists(
    input.followerId,
    input.followingId
  );

  if (!isFollowing) {
    throw new AppError('Not following this user', 404);
  }

  // Delete follow relationship
  await followRepository.delete(input.followerId, input.followingId);

  return { success: true, message: 'Successfully unfollowed user' };
}
