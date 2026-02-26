import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { updateUserSchema, listUsersQuerySchema } from './schemas/user.schemas';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users (find people)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async listUsers(
    @Query(new ZodValidationPipe(listUsersQuerySchema)) query: { page: number; limit: number; search?: string },
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const search = query.search?.trim();
    const data = await this.usersService.listUsers({ page, limit, search: search || undefined });
    return { success: true, data };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile (requires JWT)' })
  @ApiResponse({ status: 200, description: 'Current user with counts' })
  @ApiResponse({ status: 401, description: 'No or invalid token' })
  async getMe(@CurrentUser() user: { userId: string }) {
    const data = await this.usersService.getMe(user.userId);
    return { success: true, data };
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user (requires JWT)' })
  @ApiResponse({ status: 200, description: 'Updated user' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'No or invalid token' })
  async updateUser(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(updateUserSchema)) body: { name?: string; bio?: string; avatar?: string },
  ) {
    const data = await this.usersService.updateUser(user.userId, body);
    return { success: true, data };
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get followers of user by ID' })
  @ApiResponse({ status: 200, description: 'List of followers' })
  async getFollowers(@Param('id') id: string) {
    const data = await this.usersService.getFollowers(id);
    return { success: true, data };
  }

  @Get(':id/following')
  @ApiOperation({ summary: 'Get users that the user follows' })
  @ApiResponse({ status: 200, description: 'List of following' })
  async getFollowing(@Param('id') id: string) {
    const data = await this.usersService.getFollowing(id);
    return { success: true, data };
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow or unfollow user (requires JWT)' })
  @ApiResponse({ status: 200, description: 'Follow state and message' })
  @ApiResponse({ status: 401, description: 'No or invalid token' })
  async toggleFollow(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    const data = await this.usersService.toggleFollow(user.userId, id);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public user profile by ID' })
  @ApiResponse({ status: 200, description: 'User public data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    const data = await this.usersService.getUserById(id);
    return { success: true, data };
  }
}
