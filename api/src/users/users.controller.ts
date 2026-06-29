import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { Post } from '@nestjs/common';
import { RequestAccessDto } from './dto/request-access.dto';

import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';

@Controller('users')
@UseGuards(SessionAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@Req() req: Request) {
    return this.usersService.findById(req.session.userId!);
  }

  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.session.userId!, dto);
  }

  @Post('request-access')
  async requestAccess(@Req() req: Request, @Body() dto: RequestAccessDto) {
    return this.usersService.requestAccess(req.session.userId!, dto);
  }
}
