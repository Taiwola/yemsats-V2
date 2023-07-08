import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { UserInterceptor } from './interceptors/interceptors';
import { AuthGuard } from './gaurds/auth.gaurd';
import { RolesGaurd } from './gaurds/roles.gaurd';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([]),
    MailModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserInterceptor, AuthGuard, RolesGaurd],
  exports: [UserInterceptor, AuthGuard, RolesGaurd],
})
export class AuthModule {}
