import { AllExceptionsFilter } from './filters/http-exception.filter';
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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/entites/user.entity';

@Module({
  imports: [
    AuthModule,
    PostModule,
    UserModule,
    LikesModule,
    JwtModule,
    TypeOrmModule.forFeature([User]),
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
        connectString: config.get('DATABASE_CONNECT_STRING'),
        synchronize: config.get('APP_MODE') === 'development',
        logging: config.get('APP_MODE') === 'development',
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
