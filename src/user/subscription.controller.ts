import {
  Controller,
  Post,
  ParseUUIDPipe,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entites/user.entity';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscriptions')
@Controller('subscribe')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiCreatedResponse({ description: 'user followed successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiNotFoundResponse({ description: 'invalid user id provided' })
  @Post('/follow/:userId')
  async followUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: User,
  ) {
    return await this.subscriptionService.followUser(userId, user);
  }

  @ApiOkResponse({ description: 'user un-followed successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiNotFoundResponse({ description: 'invalid user id provided' })
  @Delete('/unfollow/:userId')
  async unFollowUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() user: User,
  ) {
    return await this.subscriptionService.unFollowUser(userId, user);
  }

  @ApiOkResponse({ description: 'subscriptions fetched successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @Get('subscriptions')
  async getSubscriptions(@CurrentUser() user: User) {
    return await this.subscriptionService.getSubscriptions(user);
  }

  @ApiOkResponse({ description: 'subscribed posts fetched successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @Get('subscriptions/posts')
  async getSubscribedPosts(@CurrentUser() user: User) {
    return await this.subscriptionService.getSubscribedPosts(user);
  }
}
