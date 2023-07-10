import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { UserRole } from './entities/user.entity';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

type CloudinaryType = UploadApiErrorResponse | UploadApiResponse;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // methods
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // check if user exist in the DB
    const userExist = await this.userRepository.findOne({
      where: { email: email },
    });

    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.CONFLICT);
    }

    const hashPwd = await bcrypt.hash(password, 10);
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashPwd,
      });

      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createAdmin(createAdmin: CreateUserDto) {
    // check admin exists or not in database and then add it to the db with default credentials
    const findUser = await this.getUser(createAdmin.email);

    if (findUser) {
      throw new HttpException(
        {
          message:
            'user already exist, need to make a request to be made an admin',
        },
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(createAdmin.password, 10);

    try {
      const user = this.userRepository.create({
        ...createAdmin,
        password: hashedPassword,
        roles: UserRole.ADMIN,
      });

      const savedUser = await this.userRepository.save(user);

      const { password, ...result } = savedUser;

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async comparePassword(email: string, password: string) {
    try {
      const userExist = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!userExist) {
        throw new Error('user does not exist');
      }

      const cmpPwd = await bcrypt.compare(password, userExist.password);

      if (!cmpPwd) {
        return false;
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(hashPwd: string, userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ password: hashPwd })
        .where('id = :id', { id: userId })
        .execute();
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw new HttpException(
        'Error updating password',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateImg(imageUrl: CloudinaryType | string, userId: string) {
    const updateUser = await this.userRepository.update(
      { id: userId },
      { profileImg: imageUrl.toString() },
    );

    if (updateUser.affected > 0) {
      const newUser = await this.getUserById(userId);
      const { password, ...result } = newUser;
      return result;
    }
  }

  // user methods
  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: Request) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    if (req.user.id !== user.id) {
      throw new HttpException(
        { message: 'only owner of this account can update this account' },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const updateUser = await this.userRepository.update(
        { id: id },
        { ...updateUserDto },
      );
      if (updateUser.affected > 0) {
        const newUser = await this.getUserById(id);
        return newUser;
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'error in updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserToAdmin(id: string, req: Request) {
    const userId = await this.getUserById(id);

    if (!userId) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const reqUserId = req.user.id;

    const findUser = await this.getUserById(reqUserId);

    if (!findUser) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    // check for admin role and permission to make changes on other users data except their own details
    if (userId.roles === UserRole.ADMIN) {
      throw new HttpException('user already an admin', HttpStatus.CONFLICT);
    }

    try {
      const updateUser = await this.userRepository.update(
        { id: id },
        { roles: UserRole.ADMIN },
      );
      if (updateUser.affected > 0) {
        const user = await this.getUserById(id);
        return user;
      }
    } catch (error) {
      console.log(`Error updating ${id} as Admin`, error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string, req: Request) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    const userId = req.user.id;

    const findUser = await this.getUserById(userId);

    if (findUser.id !== user.id && findUser.roles !== 'ADMIN') {
      throw new HttpException(
        'user is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.userRepository.remove(user);
      return { message: 'user deleted' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
