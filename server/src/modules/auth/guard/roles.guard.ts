import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/users/dtos/user-entity.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      process.env.ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(), // Getting required roles from metadata
      ],
    );
    if (!requiredRoles) {
      return true; // If no roles are specified, allow access
    }

    const { user } = context.switchToHttp().getRequest(); // Getting user information from the request
    return requiredRoles.some((role) => user.role?.includes(role)); // Checking if user has any of the required roles
  }
}
