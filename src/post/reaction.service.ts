import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { Posts } from './entities/post.entity';
import { Reaction, ReactionTypes } from './entities/reaction.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
  ) {}

  async reactToPost(postId: string, reactionType: ReactionTypes, user: User) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('invalid post id provided');
    }
    const userHasReacted = await this.reactionRepo.findOneBy({
      post: { id: post.id },
      user: { id: user.id },
    });

    if (userHasReacted) {
      throw new ForbiddenException('user has already reacted to post');
    }

    const reaction = new Reaction();
    reaction.user = user;
    reaction.reaction = reactionType;
    post.reactions = post.reactions.concat(reaction);

    await this.postRepo.save(post);
  }

  async unreactToPost(postId: string, user: User) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) {
      throw new BadRequestException('invalid post id provided');
    }
    await this.reactionRepo.delete({
      post: { id: post.id },
      user: { id: user.id },
    });
  }
}
