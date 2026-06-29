import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import type { Request } from 'express';

import { TelegramService } from './telegram.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(
    private readonly telegramService: TelegramService,
  ) {}

  @Get('connect')
  @UseGuards(SessionAuthGuard)
  async connect(
    @Req() req: Request,
  ) {
    return this.telegramService.generateConnectionLink(
      req.session.userId!,
    );
  }

  @Post('test-message')
  @UseGuards(SessionAuthGuard)
  async sendTestMessage(@Req() req: Request) {
    return this.telegramService.sendTestMessage(req.session.userId!);
  }

  @Post('webhook')
  async handleWebhook(@Body() update: any) {
    return this.telegramService.handleUpdate(update);
  }

  @Post('weather-report')
  @UseGuards(SessionAuthGuard)
  async sendWeatherReport(@Req() req: Request) {
    return this.telegramService.sendCurrentWeatherReport(req.session.userId!);
  }
}
