import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Req,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create.property.dto';
import { UpdatePropertyDto } from './dto/update.property';
import { Request } from 'express';
import { Roles } from '../auth/decorators/user.roles';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { UserRole } from '../user/entities/user.entity';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Post('add')
  async addProperty(
    @Body() createProperty: CreatePropertyDto,
    @Req() req: Request,
  ) {
    return await this.propertyService.addProperty(createProperty, req);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('update/:id')
  async updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProperty: UpdatePropertyDto,
    @Req() req: Request,
  ) {
    return await this.propertyService.updateProperty(id, updateProperty, req);
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get('all')
  async getAllProperty() {
    return await this.propertyService.getAllProperty();
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Get(':id')
  async getOneProperty(@Param('id', ParseUUIDPipe) id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Delete('delete/:id')
  async deleteProperty(@Param('id', ParseUUIDPipe) id: string) {
    return await this.propertyService.deleteProperty(id);
  }
}
