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
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create.property.dto';
import { UpdatePropertyDto } from './dto/update.property';
import { Request } from 'express';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('add')
  async addProperty(
    @Body() createProperty: CreatePropertyDto,
    @Req() req: Request,
  ) {
    return await this.propertyService.addProperty(createProperty, req);
  }

  @Patch('update/:id')
  async updateProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProperty: UpdatePropertyDto,
    @Req() req: Request,
  ) {
    return await this.propertyService.updateProperty(id, updateProperty, req);
  }

  @Get('all')
  async getAllProperty() {
    return await this.propertyService.getAllProperty();
  }

  @Get(':id')
  async getOneProperty(@Param('id', ParseUUIDPipe) id: string) {
    return await this.propertyService.getOneProperty(id);
  }

  @Delete('delete/:id')
  async deleteProperty(@Param('id', ParseUUIDPipe) id: string) {
    return await this.propertyService.deleteProperty(id);
  }
}
