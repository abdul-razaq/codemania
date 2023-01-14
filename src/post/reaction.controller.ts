import { ReactionService } from './reaction.service';
import { Controller, Delete, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entites/user.entity';
import { ReactionTypes } from './entities/reaction.entity';

@ApiTags('Reactions')
@Controller('posts/react')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @ApiCreatedResponse({ description: 'post reacted to successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({ description: 'invalid post id provided' })
  @ApiForbiddenResponse({
    description: 'user is not allowed to react to post more than once',
  })
  @Post('/:postId')
  async reactToPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query('type') reactionType: ReactionTypes,
    @CurrentUser() user: User,
  ) {
    return await this.reactionService.reactToPost(postId, reactionType, user);
  }

  @ApiCreatedResponse({ description: 'post unreacted to successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({ description: 'invalid post id provided' })
  @Delete('/:postId')
  async unreactToPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() user: User,
  ) {
    return await this.reactionService.unreactToPost(postId, user);
  }
}
