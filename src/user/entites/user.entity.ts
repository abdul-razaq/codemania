import * as argon2 from 'argon2';
import { Exclude, Expose } from 'class-transformer';
import { Posts } from 'src/post/entities/post.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 250 })
  password: string;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdOn: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedOn: Date;

  @Expose()
  get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password, { saltLength: 10 });
  }

  @OneToMany(() => Posts, (posts) => posts.creator)
  posts: Posts[];
}
