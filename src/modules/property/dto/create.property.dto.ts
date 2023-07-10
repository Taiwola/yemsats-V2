import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PropertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  landSize: string;

  @IsNumber()
  numberOfBathroom: number;

  @IsNumber()
  numberOfBedroom: number;
}
