import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './schemas/auth.schemas';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: { email: string; username: string; password: string; name?: string },
  ) {
    const result = await this.authService.register(body);
    return { success: true, data: result };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Returns user and tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: { email: string; password: string },
  ) {
    const result = await this.authService.login(body);
    return { success: true, data: result };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Returns new access token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Body(new ZodValidationPipe(refreshTokenSchema)) body: { refreshToken: string },
  ) {
    const result = await this.authService.refresh(body);
    return { success: true, data: result };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout (invalidates refresh token)' })
  @ApiResponse({ status: 200, description: 'Logged out' })
  @ApiResponse({ status: 401, description: 'No or invalid token' })
  async logout(@Body() body: { refreshToken?: string }) {
    await this.authService.logout({ refreshToken: body.refreshToken ?? '' });
    return { success: true, message: 'Logged out successfully' };
  }
}
