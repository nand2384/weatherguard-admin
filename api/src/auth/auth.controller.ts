import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const userId = (req.user as any).id;
    const token = await this.jwtService.signAsync({ id: userId });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL')!;
    res.redirect(`${frontendUrl}?token=${token}`);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.status(204).send();
  }
}
