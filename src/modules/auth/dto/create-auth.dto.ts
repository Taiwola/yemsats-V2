import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  phone_no: number;

  @IsString()
  @IsNotEmpty()
  location: string;
}
