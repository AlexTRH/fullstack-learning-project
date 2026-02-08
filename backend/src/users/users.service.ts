import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  FOLLOW_REPOSITORY,
} from '../infrastructure/infrastructure.module';
import type { UserRepository } from '../domain/interfaces/UserRepository';
import type { FollowRepository } from '../domain/interfaces/FollowRepository';
import { getMeUseCase } from '../application/use-cases/users/GetMeUseCase';
import { getUserByIdUseCase } from '../application/use-cases/users/GetUserByIdUseCase';
import { listUsersUseCase } from '../application/use-cases/users/ListUsersUseCase';
import { updateUserUseCase } from '../application/use-cases/users/UpdateUserUseCase';
import { getFollowersUseCase } from '../application/use-cases/follows/GetFollowersUseCase';
import { getFollowingUseCase } from '../application/use-cases/follows/GetFollowingUseCase';
import { followUserUseCase } from '../application/use-cases/follows/FollowUserUseCase';
import { unfollowUserUseCase } from '../application/use-cases/follows/UnfollowUserUseCase';
import type { User, UserPublicData, UserWithCounts } from '../domain/entities/User';
import type { UpdateUserData } from '../domain/entities/User';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(FOLLOW_REPOSITORY) private readonly followRepository: FollowRepository,
  ) {}

  async getMe(userId: string): Promise<UserWithCounts> {
    return getMeUseCase({ userId }, { userRepository: this.userRepository });
  }

  async listUsers(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ users: UserPublicData[]; total: number; page: number; limit: number }> {
    return listUsersUseCase(params, { userRepository: this.userRepository });
  }

  async getUserById(userId: string): Promise<UserPublicData> {
    return getUserByIdUseCase({ userId }, { userRepository: this.userRepository });
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    return updateUserUseCase({ userId, data }, { userRepository: this.userRepository });
  }

  async getFollowers(userId: string): Promise<UserPublicData[]> {
    return getFollowersUseCase(
      { userId },
      { followRepository: this.followRepository, userRepository: this.userRepository },
    );
  }

  async getFollowing(userId: string): Promise<UserPublicData[]> {
    return getFollowingUseCase(
      { userId },
      { followRepository: this.followRepository, userRepository: this.userRepository },
    );
  }

  async toggleFollow(followerId: string, followingId: string): Promise<{ success: boolean; message: string; isFollowing: boolean }> {
    const isFollowing = await this.followRepository.exists(followerId, followingId);
    if (isFollowing) {
      const result = await unfollowUserUseCase(
        { followerId, followingId },
        { followRepository: this.followRepository, userRepository: this.userRepository },
      );
      return { ...result, isFollowing: false };
    }
    const result = await followUserUseCase(
      { followerId, followingId },
      {
        followRepository: this.followRepository,
        userRepository: this.userRepository,
      },
    );
    return { ...result, isFollowing: true };
  }
}
