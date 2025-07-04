import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserRoles } from './entities/user.entity';

@Serialize(UserDto)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  async createUser(@Body() userPayload: CreateUserDto) {
    return await this.usersService.create(userPayload);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Get('/all')
  async getAllUsers() {
    return await this.usersService.getAll();
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
