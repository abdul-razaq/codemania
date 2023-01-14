import { Reaction } from './reaction.entity';
import { Exclude } from 'class-transformer';
import { User } from 'src/user/entites/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  post: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  creator: User;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedOn: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.post, {
    eager: true,
    cascade: true,
  })
  reactions: Reaction[];
}
