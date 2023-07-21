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
  ParseEnumPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create.property.dto';
import { UpdatePropertyDto } from './dto/update.property';
import { Request } from 'express';
import { Roles } from '../auth/decorators/user.roles';
import { RolesGaurd } from '../auth/gaurds/roles.gaurd';
import { UserRole } from '../user/entities/user.entity';
import { statusDto } from './dto/status.dto';
import {
  Property,
  PropertyStatus,
  PropertyType,
} from './entities/property.entity';
import { diskStorage } from 'multer';
import fs from 'fs';
import path from 'path';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  createMulterStorage = () =>
    diskStorage({
      destination: './uploads', // Specify the directory where you want to store the uploaded files
      filename: (req, file, cb) => {
        const uniqueSuffix = Array(32)
          .fill(null)
          .map(() => {
            const randomChar = Math.floor(Math.random() * 26) + 97; // Random lowercase character code
            return String.fromCharCode(randomChar);
          })
          .join('');

        const fileExtension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}.${fileExtension}`);
      },
    });

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Post('add')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'salesImage', maxCount: 1 },
      { name: 'propertyImage', maxCount: 6 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async addProperty(
    @Body() createProperty: CreatePropertyDto,
    @Req() req: Request,
    @UploadedFiles(
      new ParseFilePipeBuilder().build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: {
      salesImage?: Express.Multer.File[];
      propertyImage?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const video = files.video ? files.video[0] : null;
    const salesImg = files.salesImage ? files.salesImage[0] : null;
    const property = files.propertyImage;
    const propertyImg = property.map((property) => {
      return property;
    });

    return await this.propertyService.addProperty(
      createProperty,
      req,
      salesImg,
      propertyImg,
      video,
    );
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

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('status/:id')
  async listProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() status: statusDto,
    @Req() req: Request,
  ) {
    return await this.propertyService.listProperties(id, status, req);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('sold/:id')
  async soldProperty(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return await this.propertyService.soldProperty(id, req);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('features/:id')
  async addFeatures(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() feature: string[],
    @Req() req: Request,
  ) {
    return await this.propertyService.addFeatures(id, feature, req);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGaurd)
  @Patch('tags/:id')
  async addTags(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() tags: string[],
    @Req() req: Request,
  ) {
    return await this.propertyService.addTags(id, tags, req);
  }

  @Get('status/:status')
  async getStatus(
    @Param('status', new ParseEnumPipe(PropertyStatus)) status: PropertyStatus,
  ) {
    return await this.propertyService.getStatus(status);
  }

  @Get('type/:type')
  async getPropertyType(
    @Param('type', new ParseEnumPipe(PropertyType)) type: PropertyType,
  ) {
    return await this.propertyService.getPropertyType(type);
  }

  @Get('lastest')
  async getLastestProperties() {
    return await this.propertyService.getLatestProperty();
  }

  @Get('search')
  async searchByPriceRange(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
  ) {
    return await this.propertyService.getPropertiesByPriceRange(
      minPrice,
      maxPrice,
    );
  }
}
