import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response } from 'express';

export interface SignInInterface {
  password: string;
  email: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  signupUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }

  @Post('signin')
  async signin(@Body() signinInterface: SignInInterface, @Res() res: Response) {
    return await this.authService.signInUser(signinInterface, res);
  }

  @Post('forgot')
  async forgotPassword(@Body() email: ForgotPasswordInterface) {
    return await this.authService.forgotPassword(email);
  }

  @Post('reset-password/:id')
  async resetPassword(@Param('id') id: string, @Body() body: UpdateAuthDto) {
    this.authService.resetPassword(id, body);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
