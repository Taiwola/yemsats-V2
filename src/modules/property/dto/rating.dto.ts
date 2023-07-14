import { Max, Min, IsOptional } from 'class-validator';

export class RatingDto {
  @IsOptional()
  @Min(1)
  @Max(5)
  propertyRating?: number;

  @IsOptional()
  @Min(1)
  @Max(5)
  valueRating?: number;

  @IsOptional()
  @Min(1)
  @Max(5)
  locationRating?: number;

  @IsOptional()
  @Min(1)
  @Max(5)
  supportRating?: number;
}
