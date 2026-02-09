/**
 * Domain interface: FollowRepository
 * Defines the contract for follow relationship data access
 */

import { CreateFollowData, Follow } from '../entities/Follow';
import { UserPublicData } from '../entities/User';

export interface FollowRepository {
  create(data: CreateFollowData): Promise<Follow>;
  delete(followerId: string, followingId: string): Promise<void>;
  exists(followerId: string, followingId: string): Promise<boolean>;
  findFollowers(userId: string): Promise<UserPublicData[]>;
  findFollowing(userId: string): Promise<UserPublicData[]>;
  countFollowers(userId: string): Promise<number>;
  countFollowing(userId: string): Promise<number>;
}
