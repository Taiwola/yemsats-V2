import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { CreatePropertyDto } from './dto/create.property.dto';
import { UpdatePropertyDto } from './dto/update.property';
import { statusDto } from './dto/status.dto';
import {
  Property,
  PropertyStatus,
  PropertyType,
} from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    private userService: UserService,
    @InjectRepository(Property)
    private propertyRespository: Repository<Property>,
  ) {}

  // methods
  async findProperty(id: string) {
    const findProperty = await this.propertyRespository.findOne({
      where: { id: id },
      relations: ['ADMIN'],
    });
    return findProperty;
  }

  async saveImg(imgUrl: string[], id: string) {
    const property = await this.findProperty(id);
    property.images = imgUrl;
    try {
      return this.propertyRespository.save(property);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to update the image property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveVideo(videoUrl: string, id: string) {
    const property = await this.findProperty(id);
    property.video = videoUrl;
    try {
      return this.propertyRespository.save(property);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to update the image property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // CRUD methods
  async addProperty(createProperty: CreatePropertyDto, req: Request) {
    const user = await this.userService.getUserById(req.user.id);

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const saveProperty = this.propertyRespository.create({
        ...createProperty,
        ADMIN: user,
        salesSuportName: user.name,
        salesSuportNum: user.phone_no,
        salesSupportAvatar: user.profileImg,
      });

      const savedProperty = await this.propertyRespository.save(saveProperty);

      return {
        message: 'successfully added the property.',
        data: { ...savedProperty },
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProperty(
    id: string,
    updateProperty: UpdatePropertyDto,
    req: Request,
  ) {
    const findProperty = await this.propertyRespository.findOne({
      where: { id: id },
      relations: ['ADMIN'],
    });

    if (!findProperty) {
      throw new HttpException('Property not found', HttpStatus.BAD_REQUEST);
    }

    const userId = findProperty.ADMIN.id;

    const findUser = await this.userService.getUserById(userId);

    if (!findUser) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    if (req.user.id !== findUser.id) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const newProperty = await this.propertyRespository.update(
        { id: id },
        { ...updateProperty },
      );

      if (newProperty.affected) {
        const property = await this.propertyRespository.findOne({
          where: { id: id },
        });
        return property;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to update property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProperty() {
    const property = await this.propertyRespository.find();
    return property;
  }

  async getOneProperty(id: string) {
    const property = await this.propertyRespository.findOneOrFail({
      where: { id: id },
    });
    return property;
  }

  async deleteProperty(id: string) {
    const property = await this.propertyRespository.findOne({
      where: { id: id },
    });

    if (!property) {
      throw new HttpException(
        'Property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const removeProperty = await this.propertyRespository.remove(property);
      return {
        message: 'successfully deleted Property' + '' + id,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // properties method
  async listProperties(id: string, status: statusDto, req: Request) {
    const property = await this.findProperty(id);

    if (!property) {
      throw new HttpException(
        'Property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (status.status === PropertyStatus.Listed) {
      property.status = status.status;
    }

    if (status.status === PropertyStatus.Unlisted) {
      property.status = status.status;
    }

    return await this.propertyRespository.save(property);
  }

  async soldProperty(id: string, req: Request) {
    const property = await this.findProperty(id);

    if (!property) {
      throw new HttpException(
        'Property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    property.status = PropertyStatus.Sold;

    return await this.propertyRespository.save(property);
  }

  async addFeatures(id: string, feature: string[], req: Request) {
    const property = await this.findProperty(id);

    if (!property) {
      throw new HttpException(
        'Property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    property.Feature = feature;

    try {
      return await this.propertyRespository.save(property);
    } catch (error) {
      console.log(`Error adding features ${error}`);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addTags(id: string, tags: string[], req: Request) {
    const property = await this.findProperty(id);

    if (!property) {
      throw new HttpException(
        'Property does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (req.user.id !== property.ADMIN.id) {
      throw new HttpException('User is unauthorized', HttpStatus.UNAUTHORIZED);
    }

    property.Tags = tags;

    try {
      return await this.propertyRespository.save(property);
    } catch (error) {
      console.log(`Error adding features ${error}`);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStatus(statusProperty: PropertyStatus) {
    const property = await this.propertyRespository.find({
      where: { status: statusProperty },
    });

    return property;
  }

  async getPropertyType(propertyType: PropertyType) {
    const property = await this.propertyRespository.find({
      where: { propertyType: propertyType },
    });

    return property;
  }

  async getLatestProperty() {
    const property = await this.propertyRespository.find({
      order: { createdAt: 'DESC' },
    });

    return property;
  }

  async getPropertiesByPriceRange(minPrice: number, maxPrice: number) {
    const properties = await this.propertyRespository.find({
      where: { price: Between(minPrice, maxPrice) },
    });

    return properties;
  }
}
