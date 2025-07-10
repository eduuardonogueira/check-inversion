import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guard/jwt.guard';
import { LocalGuard } from './guard/local.guard';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@CurrentUser() user: User): Promise<{ accessToken: string }> {
    return await this.authService.login(user);
  }

  // @Serialize(UserDto)
  @UseGuards(JwtGuard)
  @Get('/profile')
  async profile(@CurrentUser() user: User) {
    return user;
  }
}
