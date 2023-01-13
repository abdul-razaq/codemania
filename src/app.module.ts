import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { LikesModule } from './likes/likes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './config/validate-env.config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    PostModule,
    UserModule,
    LikesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validateEnv(),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ttl: config.get('THROTTLER_TTL'),
          limit: config.get('THROTTLER_LIMIT'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        connectString:
          'postgres://oxizbklr:veKaIHd87by20T4cnO4HZHuFZjyDdJWL@chunee.db.elephantsql.com/oxizbklr',
        synchronize: config.get('APP_MODE') === 'development',
        logging: config.get('APP_MODE') === 'development',
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
