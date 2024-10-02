import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from 'src/role/enums/role';
config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_TOKEN;

    try {
      const decodedToken = this.jwtService.verify(token, { secret: secret });

      const permissionRole: string = decodedToken['role'];
      if (!requiredRoles.includes(permissionRole as Role)) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
