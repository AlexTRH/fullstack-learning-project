/**
 * Domain interface: RefreshTokenRepository
 * Defines the contract for refresh token storage
 */

export interface RefreshTokenRepository {
  create(token: string, userId: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<{ userId: string; expiresAt: Date } | null>;
  deleteByToken(token: string): Promise<void>;
}
