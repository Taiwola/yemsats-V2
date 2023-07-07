import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config/jwt.config';
import { mailerConfig } from './config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthModule,
    NestMailerModule.forRoot(mailerConfig),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
