import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      const updateUser = await this.userRepository.update(
        { id: id },
        { ...updateUserDto },
      );
      return updateUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'error in updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('user does not exist', HttpStatus.BAD_REQUEST);
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
