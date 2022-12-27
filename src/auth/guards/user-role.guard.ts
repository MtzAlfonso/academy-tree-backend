import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Role[] = this.reflector.get<Role[]>(
      META_ROLES,
      ctx.getHandler(),
    );

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    for (const role of user.roles) {
      if (validRoles.length === 0) return true;
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(
      `User with email ${user.email} needs a valid role: [${validRoles}]`,
    );
  }
}
