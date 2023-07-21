import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';
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

  @IsArray()
  feature: string[];

  @IsArray()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  salesSuportName: string;

  @IsNumber()
  salesSuportNum: number;
}
