import { AuthGuard } from './guards/auth.guard';
import { User } from './../user/entites/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('ACCESS_TOKEN_SECRET'),
        signOptions: {
          audience: config.get('ACCESS_TOKEN_AUDIENCE'),
          issuer: config.get('ACCESS_TOKEN_ISSUER'),
          expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
