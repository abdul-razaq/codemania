import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
})
export class AuthModule {}
