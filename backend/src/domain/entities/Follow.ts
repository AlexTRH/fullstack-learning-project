/**
 * Domain entity: Follow
 * Represents a follow relationship between users
 */

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface CreateFollowData {
  followerId: string;
  followingId: string;
}
