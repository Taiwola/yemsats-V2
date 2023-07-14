import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { PropertyType } from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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
}
