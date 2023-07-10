import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';

@Module({
  imports: [UserModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
