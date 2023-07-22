import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Request } from 'express';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { Roles } from '../auth/decorators/user.roles';
import { UserRole } from '../user/entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Post('create/:id')
  async create(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return await this.bookingsService.create(req, id);
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
