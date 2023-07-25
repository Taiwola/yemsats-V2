import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { JwtPayLoad } from '../interfaces/auth.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    public jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      return true;
    }

    try {
      const authorizationHeader = request?.headers?.authorization;
      const token = authorizationHeader?.split(' ')[1];

      if (!token) {
        return true;
      }

      const verify = await this.validateToken(token);

      if (!verify) {
        throw new Error("Can't decode JWT");
      }

      const payload = this.jwtService.decode(token) as JwtPayLoad;

      const user = await this.userService.getUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
