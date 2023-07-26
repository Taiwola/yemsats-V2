import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { PropertyService } from '../property/property.service';
import { Request } from 'express';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private userService: UserService,
    private propertyService: PropertyService,
  ) {}

  async create(req: Request, propertyId: string) {
    const user = req.user;
    const userId = user.id;

    const findUser = await this.userService.getUserById(userId);

    if (!findUser) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const findProperty = await this.propertyService.findProperty(propertyId);

    if (!findProperty) {
      throw new HttpException(
        'property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBooking = this.bookingRepository.create({
      user: findUser,
      property: findProperty,
      booking: true,
    });

    const booking = await this.bookingRepository.save(newBooking);

    return booking;
  }

  async findAll() {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('booking.user', 'user')
      .getMany();
    return booking;
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.property', 'property')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.id = :id', { id })
      .getOne();
    return booking;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  async remove(id: string) {
    const booking = await this.findOne(id);

    const removeBooking = await this.bookingRepository.remove(booking);

    return {
      message: 'successfully deleted' + '' + id,
    };
  }
}
