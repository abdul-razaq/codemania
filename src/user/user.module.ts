import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { User } from './entites/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
