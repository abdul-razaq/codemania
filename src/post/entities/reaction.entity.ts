import { Expose } from 'class-transformer';
import { User } from 'src/user/entites/user.entity';
import { Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from './post.entity';

export enum ReactionTypes {
  like = 'like',
  love = 'love',
  interesting = 'interesting',
  dislike = 'dislike',
}

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReactionTypes, default: ReactionTypes.like })
  reaction: ReactionTypes;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdOn: Date;

  @ManyToOne(() => Posts, (posts) => posts.reactions, {
    onDelete: 'CASCADE',
  })
  post: Posts[];

  @Expose()
  @ManyToOne(() => User)
  user: User;
}
