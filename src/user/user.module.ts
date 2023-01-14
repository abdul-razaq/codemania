import { SubscriptionController } from './subscription.controller';
import { Subscription } from './entites/subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entites/user.entity';
import { SubscriptionService } from './subscription.service';
import { Posts } from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription, Posts])],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class UserModule {}
