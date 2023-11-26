import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from 'src/users/entities/user.entity';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!userRoles) return true;
    if (userRoles.length === 0) return true;
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as User;
    if (!user) throw new BadRequestException('User not found');
    if (userRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.name} need a valid role: [${userRoles}]`,
    );
  }
}
