import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { CreatePropertyDto } from './dto/create.property.dto';
import { UpdatePropertyDto } from './dto/update.property';
import { Property } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    private userService: UserService,
    @InjectRepository(Property)
    private propertyRespository: Repository<Property>,
  ) {}

  async addProperty(createProperty: CreatePropertyDto, req: Request) {
    const user = await this.userService.getUserById(req.user.id);

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const saveProperty = this.propertyRespository.create({
        ...createProperty,
        user: user,
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
      relations: ['user'],
    });

    if (!findProperty) {
      throw new HttpException('Property not found', HttpStatus.BAD_REQUEST);
    }

    const userId = findProperty.user.id;

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
}
