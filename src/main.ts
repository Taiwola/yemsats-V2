import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { UserReq } from './modules/auth/interfaces/auth.interfaces';
import { join } from 'path';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: UserReq;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  await app.listen(3000);
}
bootstrap();
