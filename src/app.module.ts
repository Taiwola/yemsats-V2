import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, TypeOrmModule.forRoot(typeormConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
