import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  });

  app.use(cookieParser());

  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGODB_URI'),
      }),
      cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );

  await app.listen(configService.get<number>('PORT') || 3000);
  console.log(`Server is running on port ${configService.get<number>('PORT') || 3000}`);
}

bootstrap();
