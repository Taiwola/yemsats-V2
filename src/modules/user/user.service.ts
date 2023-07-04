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
    return 'This action adds a new user';
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

  async comparePassword(email: string, password: string) {
    try {
      const userExist = this.userRepository.findOne({
        where: { email: email },
      });
      if (!userExist) {
        throw new Error('user does not exist');
      }

      const cmpPwd = await bcrypt.compare(password, (await userExist).password);

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

  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
