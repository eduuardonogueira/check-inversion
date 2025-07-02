import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateLdapUserDto } from './dtos/create-ldap-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne({
    id,
    email,
    username,
  }: {
    id?: string;
    email?: string;
    username?: string;
  }) {
    const findUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          id ? { id } : {},
          email ? { email } : {},
          username ? { username } : {},
        ],
      },
    });

    return findUser;
  }

  async getAll() {
    const findAllUsers = await this.prismaService.user.findMany();

    if (!findAllUsers) {
      throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
    }

    return findAllUsers;
  }

  async create(userPayload: CreateUserDto, currentUser?: any) {
    const { email, role } = userPayload;

    // if (role !== 'USER') {
    //   if (!currentUser || currentUser?.role !== 'admin') {
    //     throw new HttpException('Unauthorized action', HttpStatus.UNAUTHORIZED);
    //   }
    // }

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        'A user with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    try {
      const { password, ...newUpdateUser } = userPayload;

      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);

      const partialUser = {
        password: hash,
        ...newUpdateUser,
      };

      const createdUser = await this.prismaService.user.create({
        data: partialUser,
      });

      if (!createdUser) {
        throw new HttpException(
          'Error creating user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return createdUser;
    } catch (error) {
      throw new HttpException(
        error.toString(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createLdapUser(userPayload: CreateLdapUserDto) {
    const createdUser = await this.prismaService.user.create({
      data: userPayload,
    });

    return createdUser;
  }

  async delete(id: string) {
    const findUser = await this.findOne({ id });

    if (!findUser) return new NotFoundException('User not found');

    try {
      const deletedUser = await this.prismaService.user.delete({
        where: { id: findUser.id },
      });

      return deletedUser;
    } catch (error) {
      return new HttpException(
        'Something as wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: `${error}` },
      );
    }
  }
}
