import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Property]),
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
