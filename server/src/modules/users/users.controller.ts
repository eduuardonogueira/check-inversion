import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptos/serialize.interceptors';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async createUser(@Body() userPayload: CreateUserDto) {
    return await this.usersService.create(userPayload);
  }

  @Get('/all')
  async getAllUsers(@Req() req: Request) {
    return await this.usersService.getAll(/* req */);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne({ id });
    if (!foundUser) return new NotFoundException('User not found');
    return foundUser;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
