import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
    }),
  );
  await app.listen(3000);
}
bootstrap();
