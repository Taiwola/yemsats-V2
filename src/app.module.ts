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
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { UserInterceptor } from './modules/auth/interceptors/interceptors';
import { AuthGuard } from './modules/auth/gaurds/auth.gaurd';
import { RolesGaurd } from './modules/auth/gaurds/roles.gaurd';

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
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
