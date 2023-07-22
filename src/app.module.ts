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
import { UploadModule } from './modules/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { PropertyModule } from './modules/property/property.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BookingsModule } from './modules/bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthModule,
    NestMailerModule.forRoot(mailerConfig),
    JwtModule.registerAsync(jwtConfig),
    UploadModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    PropertyModule,
    CommentModule,
    ReviewsModule,
    BookingsModule,
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
    AuthGuard,
  ],
})
export class AppModule {}
