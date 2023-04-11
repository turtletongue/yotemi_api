import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';

import { ApiConfig } from '@config/api.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService).get<ApiConfig>('api');

  app.enableCors({
    origin: ['http://localhost:3000', 'https://yotemi.com'],
    credentials: true,
  });

  if (config.environment === 'production') {
    app.use(helmet());
  }

  app.useStaticAssets(join(process.cwd(), 'public'));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  if (config.environment === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Yotemi API')
      .setDescription('Yotemi API documentation')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(config.port);
}

bootstrap().then();
