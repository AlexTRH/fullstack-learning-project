import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_SERVICE,
  PASSWORD_HASHER,
} from '../infrastructure/infrastructure.module';
import type { UserRepository } from '../domain/interfaces/UserRepository';
import type { RefreshTokenRepository } from '../domain/interfaces/RefreshTokenRepository';
import type { TokenService } from '../domain/interfaces/TokenService';
import type { PasswordHasher } from '../domain/interfaces/PasswordHasher';
import { registerUseCase } from '../application/use-cases/auth/RegisterUseCase';
import { loginUseCase } from '../application/use-cases/auth/LoginUseCase';
import { refreshTokenUseCase } from '../application/use-cases/auth/RefreshTokenUseCase';
import { logoutUseCase } from '../application/use-cases/auth/LogoutUseCase';
import type { AuthResult } from '../domain/entities/Auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  private get dependencies() {
    return {
      userRepository: this.userRepository,
      refreshTokenRepository: this.refreshTokenRepository,
      tokenService: this.tokenService,
      passwordHasher: this.passwordHasher,
    };
  }

  async register(input: {
    email: string;
    username: string;
    password: string;
    name?: string;
  }): Promise<AuthResult> {
    return registerUseCase(input, this.dependencies);
  }

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    return loginUseCase(input, this.dependencies);
  }

  async refresh(input: { refreshToken: string }): Promise<{ accessToken: string }> {
    return refreshTokenUseCase(input, {
      tokenService: this.tokenService,
      refreshTokenRepository: this.refreshTokenRepository,
    });
  }

  async logout(input: { refreshToken: string }): Promise<void> {
    return logoutUseCase(input, {
      refreshTokenRepository: this.refreshTokenRepository,
    });
  }
}
