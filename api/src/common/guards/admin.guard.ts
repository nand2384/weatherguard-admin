import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { UserRole } from '../enums/user.enum';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('Login required.');
    }

    const user = await this.usersService.findById(userId);

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required.');
    }

    return true;
  }
}
