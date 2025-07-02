import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async sigIn(
    @Body() authPayload: { username: string; password: string },
  ): Promise<{ accessToken: string }> {
    const { username, password } = authPayload;

    try {
      const response = await this.authService.SignIn(username, password);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request) {
    console.log(req);

    return 'oi';
  }
}
