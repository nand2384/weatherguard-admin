import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import type { Request } from 'express';

import { TelegramService } from './telegram.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
  ) {}

  @Get('connect')
  @UseGuards(JwtAuthGuard)
  async connect(
    @Req() req: Request,
  ) {
    return this.telegramService.generateConnectionLink(
      req.user.id,
    );
  }

  @Post('test-message')
  @UseGuards(JwtAuthGuard)
  async sendTestMessage(@Req() req: Request) {
    return this.telegramService.sendTestMessage(req.user.id);
  }

  @Post('webhook')
  async handleWebhook(@Body() update: any) {
    return this.telegramService.handleUpdate(update);
  }

  @Post('weather-report')
  @UseGuards(JwtAuthGuard)
  async sendWeatherReport(@Req() req: Request) {
    return this.telegramService.sendCurrentWeatherReport(req.user.id);
  }
}
