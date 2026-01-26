/**
 * Domain interface: TokenService
 * Defines the contract for JWT token operations
 */

import { TokenPayload } from '../entities/Auth.js';

export interface TokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
