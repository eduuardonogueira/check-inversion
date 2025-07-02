import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { User } from '@prisma/client';
import configuration from 'src/config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwtSecret,
    });
  }

  // Definir um type JwtPayload
  async validate(payload: any): Promise<User> {
    const { username, role } = payload;
    const user = await this.usersService.findOne({
      username,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.role = role;

    return user;
  }
}
