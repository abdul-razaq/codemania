import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from 'src/user/entites/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { Posts } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepo: Repository<Posts>,
  ) {}
  async getPosts() {
    return await this.postRepo.find();
  }

  async getPost(postId: string) {
    const post = await this.postRepo.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('post does not exist');
    }
    return post;
  }

  async createPost(data: CreatePostDto, creator: User) {
    const post = new Posts();

    post.creator = creator;
    post.title = data.title;
    post.post = data.post;

    const createdPost = await this.postRepo.save(post);
    delete createdPost.creator;
    return createdPost;
  }

  async updatePost(data: UpdatePostDto, postId: string) {
    const post = await this.postRepo.findOneBy({ id: postId });

    post.post = data.post ?? post.post;
    post.title = data.title ?? post.title;

    return await this.postRepo.save(post);
  }

  async deletePost(postId: string, creator: User) {
    return await this.postRepo.delete({
      id: postId,
      creator: {
        id: creator.id,
      },
    });
  }
}
