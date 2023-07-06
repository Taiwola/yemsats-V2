import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import {
  createToken,
  refreshToken,
  forgotPasswordToken,
  JwtPayLoad,
} from '../../common/token/jwt.token';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '../mail/mail.service';
import * as jwt from 'jsonwebtoken';

export interface SignInInterface {
  password: string;
  email: string;
}

export interface ForgotPasswordInterface {
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailerService,
  ) {}
  async signup(createAuthDto: CreateAuthDto) {
    return await this.userService.create(createAuthDto);
  }

  async signInUser(signin: SignInInterface, res: Response) {
    const userExist = await this.userService.getUser(signin.email);

    if (!userExist) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const cmpPwd = await this.userService.comparePassword(
      signin.email,
      signin.password,
    );

    if (!cmpPwd) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    try {
      const token = await createToken(userExist.id, userExist.email);

      const refresh = await refreshToken(userExist.id, userExist.email);

      res.cookie('jwt', refresh, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        data: userExist,
        access_token: token,
        message: 'user logged in succesfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(email: ForgotPasswordInterface) {
    console.log(email.email);
    const userExist = await this.userService.getUser(email.email);

    console.log(userExist);

    if (!userExist) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const token = await forgotPasswordToken(email.email);

    if (!token) {
      throw new HttpException(
        'something is wrong with the token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetLink = `http://localhost:3000/auth/reset-password/${token}`;
    try {
      await this.mailService.sendMail(email.email, resetLink);

      return { message: 'mail sent' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send the reset email');
    }
  }

  async resetPassword(resetToken: string, userPassword: UpdateAuthDto) {
    const decoded = jwt.verify(
      resetToken,
      process.env.JWT_FORGOT_PASSWORD,
    ) as JwtPayLoad;
    if (!decoded) {
      throw new HttpException(
        'something is wrong with the token',
        HttpStatus.BAD_REQUEST,
      );
    }
    // TODO check for expired token
    const now = Math.floor(Date.now() / 1000);
    const expirationDate = now + 3600;

    if (decoded.exp > expirationDate) {
      throw new HttpException('token expired', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.getUser(decoded.email);

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const hashPwd = await bcrypt.hash(userPassword.password, 10);
      const changePassword = await this.userService.updatePassword(
        hashPwd,
        user.id,
      );
      console.log(`change password ${JSON.stringify({ changePassword })}`);
      return changePassword;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error changing password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
