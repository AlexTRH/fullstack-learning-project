import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { createPostSchema, updatePostSchema, listPostsQuerySchema } from './schemas/post.schemas';

@ApiTags('Posts')
@Controller('api/posts')
export class PostsController {
  constructor(@Inject(PostsService) private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'List posts (feed)' })
  @ApiResponse({ status: 200, description: 'Paginated list of posts' })
  async listPosts(
    @Query(new ZodValidationPipe(listPostsQuerySchema)) query: { page: number; limit: number; authorId?: string },
  ) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const data = await this.postsService.list({ page, limit, authorId: query.authorId });
    return { success: true, data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post (requires JWT)' })
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'No or invalid token' })
  async createPost(
    @CurrentUser() user: { userId: string },
    @Body(new ZodValidationPipe(createPostSchema)) body: { content: string; attachments?: string[] },
  ) {
    const data = await this.postsService.create(user.userId, {
      content: body.content,
      attachments: body.attachments,
    });
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, description: 'Post with author' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPost(@Param('id') id: string) {
    const data = await this.postsService.getById(id);
    return { success: true, data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update post (author only)' })
  @ApiResponse({ status: 200, description: 'Post updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async updatePost(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) body: { content?: string; attachments?: string[] },
  ) {
    const data = await this.postsService.update(id, user.userId, {
      content: body.content,
      attachments: body.attachments,
    });
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post (author only, soft delete)' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    await this.postsService.delete(id, user.userId);
    return { success: true, message: 'Post deleted' };
  }
}
