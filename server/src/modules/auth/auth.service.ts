import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LdapService } from './ldap.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private ldapService: LdapService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const findUserOnDb = await this.usersService.findOne({ username });

    if (!findUserOnDb || !findUserOnDb.password) {
      this.logger.log(`User ${username} is logging with ldap`);

      const isAuthenticated = await this.ldapService.validateUser(
        username,
        password,
      );
      if (!isAuthenticated) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const ldapUser = await this.ldapService.findOrCreateUser(username);
      return ldapUser;
    }

    const isMatch: boolean = bcrypt.compareSync(
      password,
      findUserOnDb.password,
    );

    if (!isMatch) {
      throw new BadRequestException('Wrong username or password');
    }

    return findUserOnDb;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...payload } = user;

    this.logger.warn(
      `User ${user.username} has been successfully authenticated`,
    );

    const token = this.jwtService.sign(payload, {
      secret: configuration().jwtSecret,
    });

    return {
      accessToken: token,
    };
  }
}
