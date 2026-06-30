import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    console.log("=== GUARD ===");
    console.log("Session ID:", request.session.id);
    console.log("Session:", request.session);
    console.log("Cookies:", request.headers.cookie);
    console.log("User ID:", request.session.userId);

    if (!request.session.userId) {
      throw new UnauthorizedException('Login required.');
    }

    return true;
  }
}
