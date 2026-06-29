import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    req.session.userId = (req.user as any).id;

    req.session.save((err) => {
      if (err) {
        throw err;
      }

      res.redirect(this.configService.get<string>('FRONTEND_URL')!);
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(204).send();
    });
  }
}
