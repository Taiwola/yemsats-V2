import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PropertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  landSize: string;

  @IsNumber()
  @IsNotEmpty()
  numberOfBathroom: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfBedroom: number;
}
