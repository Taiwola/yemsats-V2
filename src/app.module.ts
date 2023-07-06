import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthModule,
    NestMailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.AUTH_USER,
          clientId: process.env.AUTH_CLIENT_ID,
          clientSecret: process.env.AUTH_CLIENT_SECRET,
          refreshToken: process.env.AUTH_REFRESH_TOKEN,
          accessToken: process.env.AUTH_ACCESS_TOKEN,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
