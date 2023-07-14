import { PropertyStatus } from '../entities/property.entity';
import { IsEnum } from 'class-validator';

export class statusDto {
  @IsEnum(PropertyStatus)
  status: PropertyStatus;
}
