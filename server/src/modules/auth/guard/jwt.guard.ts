import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtStrategy: JwtStrategy, // Injecting JwtStrategy to validate JWT tokens
    private readonly reflector: Reflector, // Injecting Reflector for metadata access
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('aqui');
    const isPublic = this.reflector.get<boolean>(
      process.env.IS_PUBLIC_KEY,
      context.getHandler(), // Checking if the route is marked as public
    );
    if (isPublic) {
      return true; // If marked as public, allow access without authentication
    }

    console.log('aqui');

    return super.canActivate(context);
    // await super.canActivate(context);
    // const request = context.switchToHttp().getRequest();
    // const user = await this.jwtStrategy.validate(request.user); // Validating JWT token and extracting user information
    // request.user = user; // Setting authenticated user in the request object
    // return true; // Allowing access
  }
}
