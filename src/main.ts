import helmet from 'helmet';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { generateOpenApiConfig } from './config/open-api.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors();
  app.use(helmet());

  generateOpenApiConfig(app);

  await app.listen(3000);
}
bootstrap();
