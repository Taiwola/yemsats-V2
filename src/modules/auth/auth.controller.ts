import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response, Request } from 'express';

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
  async signin(
    @Body() signinInterface: SignInInterface,
    @Res({ passthrough: true }) res: Response,
  ) {
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

  @Post('logout')
  async logOutUser(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.logUserOut(req, res);
  }
}
