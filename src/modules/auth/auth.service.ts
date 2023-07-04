import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { createToken, refreshToken } from '../../common/token/jwt.token';
import { Response } from 'express';

export interface SignInInterface {
  password: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async create(createAuthDto: CreateAuthDto) {
    return await this.userService.create(createAuthDto);
  }

  async signInUser(signin: SignInInterface, res: Response) {
    const userExist = await this.userService.getUser(signin.email);
    console.log('auth service: ', signin.password);
    if (!userExist) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    console.log(userExist);

    const cmpPwd = await this.userService.comparePassword(
      signin.email,
      signin.password,
    );

    if (!cmpPwd) {
      throw new HttpException('invalid credentials', HttpStatus.BAD_REQUEST);
    }

    try {
      const token = await createToken(
        userExist.id,

        userExist.email,
      );

      const refresh = await refreshToken(
        userExist.id,

        userExist.email,
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
