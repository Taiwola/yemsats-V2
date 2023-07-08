import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Response, Request } from 'express';
import {
  SignInInterface,
  ForgotPasswordInterface,
} from './interfaces/auth.interfaces';
// GUARDS
import { AuthGuard } from './gaurds/auth.gaurd';
import { RolesGaurd } from './gaurds/roles.gaurd';
import { Roles } from './decorators/user.roles';
import { UserRole } from '../user/entities/user.entity';

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

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @Post('logout')
  async logOutUser(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return await this.authService.logUserOut(req, res);
  }

  @UseGuards(AuthGuard)
  @Post('test/guard')
  async testRoute() {
    console.log('I am protected');
    return true;
  }

  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  @UseGuards(RolesGaurd)
  @Post('test/role')
  role(@Req() req: Request) {
    console.log('this route is for admin');
    return req.user;
  }
}
