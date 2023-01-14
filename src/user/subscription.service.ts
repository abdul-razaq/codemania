import { Subscription } from './entites/subscription.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { Posts } from 'src/post/entities/post.entity';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
  ) {}

  async followUser(userId: string, follower: User) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user with this id does not exist');
    }
    const subscription = new Subscription();
    subscription.follower = follower;
    subscription.followed = user;

    await this.subscriptionRepo.save(subscription);
  }

  async unFollowUser(userId: string, follower: User) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user with this id does not exist');
    }
    await this.subscriptionRepo.delete({
      followed: { id: user.id },
      follower: { id: follower.id },
    });
  }

  async getSubscriptions(user: User) {
    const followers = await this.subscriptionRepo.findAndCount({
      where: {
        followed: { id: user.id },
      },
      select: {
        followed: { id: true },
      },
    });
    const following = await this.subscriptionRepo.findAndCount({
      where: {
        follower: { id: user.id },
      },
      select: {
        follower: { id: true },
      },
    });
    return {
      followers,
      following,
    };
  }

  async getSubscribedPosts(user: User) {
    const following = await this.subscriptionRepo.find({
      where: {
        followed: { id: user.id },
      },
    });

    return this.postRepo.find({
      where: {
        creator: In(following),
      },
    });
  }
}
