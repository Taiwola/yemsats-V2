import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/decorators/user.roles';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { UserRole } from './entities/user.entity';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('update-admin/:id')
  async updateUserAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return await this.userService.updateUserToAdmin(id, req);
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Patch('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    return await this.userService.update(id, updateUserDto, req);
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    console.log(req.user);
    return await this.userService.remove(id, req);
  }
}
