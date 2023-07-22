import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { UserModule } from '../user/user.module';
import { PropertyModule } from '../property/property.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';

@Module({
  imports: [
    UserModule,
    PropertyModule,
    TypeOrmModule.forFeature([Booking]),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, JwtService],
})
export class BookingsModule {}
