/**
 * Application: Use Case
 * Get list of users that a user is following
 */

import { UserPublicData } from '../../../domain/entities/User.js';
import { FollowRepository } from '../../../domain/interfaces/FollowRepository.js';
import { UserRepository } from '../../../domain/interfaces/UserRepository.js';
import { AppError } from '../../../infrastructure/config/errors.js';

export interface GetFollowingUseCaseInput {
  userId: string;
}

export async function getFollowingUseCase(
  input: GetFollowingUseCaseInput,
  dependencies: {
    followRepository: FollowRepository;
    userRepository: UserRepository;
  }
): Promise<UserPublicData[]> {
  const { followRepository, userRepository } = dependencies;

  // Check if user exists
  const user = await userRepository.findById(input.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get following
  const following = await followRepository.findFollowing(input.userId);

  return following;
}
