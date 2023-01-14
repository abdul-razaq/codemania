import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Posts } from './entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Reaction } from './entities/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Reaction])],
  providers: [PostService, ReactionService],
  controllers: [PostController, ReactionController],
})
export class PostModule {}
