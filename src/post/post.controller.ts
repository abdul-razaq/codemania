import { UpdatePostDto } from './dtos/update-post.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PublicRoute } from 'src/auth/decorators/is_public.decorator';
import { User } from 'src/user/entites/user.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostService } from './post.service';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOkResponse({ description: 'posts fetched successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @PublicRoute()
  @Get()
  async getPosts() {
    return await this.postService.getPosts();
  }

  @ApiOkResponse({ description: 'post fetched successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @PublicRoute()
  @Get('/:postId')
  async getPost(@Param('postId', ParseUUIDPipe) postId: string) {
    return await this.postService.getPost(postId);
  }

  @ApiCreatedResponse({ description: 'post fetched successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({
    description:
      'validation error, invalid parameters provided in request body',
  })
  @Post()
  async createPost(@Body() data: CreatePostDto, @CurrentUser() creator: User) {
    return await this.postService.createPost(data, creator);
  }

  @ApiOkResponse({ description: 'post updated successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({
    description:
      'validation error, invalid parameters provided in request body',
  })
  @Patch('/:postId')
  async updatePost(
    @Body() data: UpdatePostDto,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return await this.postService.updatePost(data, postId);
  }

  @ApiOkResponse({ description: 'post deleted successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @Delete('/:postId')
  async deletePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() creator: User,
  ) {
    return await this.postService.deletePost(postId, creator);
  }
}
