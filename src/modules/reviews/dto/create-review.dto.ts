import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  text: string;
}
