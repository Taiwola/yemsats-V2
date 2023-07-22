import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
// import { Observable } from 'rxjs';
import { UserRole } from 'src/modules/user/entities/user.entity';
import { JwtPayLoad } from '../interfaces/auth.interfaces';
@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(
    private userService: UserService,
    public reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (role && role.length > 0) {
      try {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization?.split(' ')[1];
        if (!token) {
          throw new Error('Token not found');
        }
        const payload = this.jwtService.decode(token) as JwtPayLoad;

        const user = await this.userService.getUserById(payload.id);

        if (!user) {
          return false;
        }

        if (role.includes(user.roles)) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else {
      return false;
    }
  }
}
