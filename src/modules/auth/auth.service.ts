// BUILT-IN IMPORTS
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
// IMPORT DTO
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
// SERVICES
import { UserService } from '../user/user.service';
import { MailerService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
// CUSTOM IMPORTS
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
// IMPORT INTERFACES
import {
  SignInInterface,
  ForgotPasswordInterface,
  JwtPayLoad,
} from './interfaces/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailerService,
    private jwtService: JwtService,
  ) {}
  // private methods or utility functions
  private async generateToken(email: string, id: string) {
    const payload = { id, email };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async generateRefreshToken(email: string, id: string) {
    const payload = { id, email };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async verifyToken(token: string) {
    try {
      const decodedPayload = (await this.jwtService.verifyAsync(
        token,
      )) as JwtPayLoad;
      const userId = decodedPayload.id;
      return userId;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private async generateForgottenPasswordToken(email: string) {
    const payload = { email }; // Wrap the email string in an object
    const expiresIn = '1h'; // Use a string to represent the expiration time (1 hour)

    const token = jwt.sign(payload, process.env.JWT_FORGOT_PASSWORD, {
      expiresIn,
    });

    return token;
  }

  // public methods
  async signup(createAuthDto: CreateAuthDto) {
    return await this.userService.create(createAuthDto);
  }

  async signupAdmin(createAdmin: CreateAuthDto) {
    return await this.userService.createAdmin(createAdmin);
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
      const token = await this.generateToken(userExist.email, userExist.id);

      const refresh = await this.generateRefreshToken(
        userExist.email,
        userExist.id,
      );

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

    const token = await this.generateForgottenPasswordToken(email.email);

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

  async refresh(req: Request, res: Response) {
    const token = req.cookies.jwt;

    if (!token) {
      throw new HttpException(
        { message: 'user not logged in' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = await this.verifyToken(token);

    if (!userId) {
      throw new UnauthorizedException(); // TODO add error handling for invalid tokens and expired ones?
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new HttpException(
        { message: 'user does not exist' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const generateNewToken = await this.generateToken(user.email, user.id);

    if (!generateNewToken) {
      console.error(`Failed to re-authenticate ${user}`);
      throw new InternalServerErrorException();
    }

    res.status(200).json({ access_token: generateNewToken });
  }

  async logUserOut(req: Request, res: Response) {
    const token = req.cookies.jwt;

    if (!token) {
      return { message: 'user logged out' };
    }

    res.clearCookie('jwt', { httpOnly: true });
    res.status(200).json({ message: 'user logged out' });
  }
}
