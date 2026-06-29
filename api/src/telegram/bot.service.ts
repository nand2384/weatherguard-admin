import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

import { TelegramService } from './telegram.service';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  private get bot(): Telegraf | undefined {
    return this.telegramService.getBot();
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
  ) {}

  onModuleInit() {
    if (!this.bot) {
      this.logger.warn('Telegram bot token not configured. Bot not started.');
      return;
    }

    this.registerHandlers();

    void this.launchBot();
  }

  private async launchBot() {
    const webhookUrl = this.configService.get<string>('TELEGRAM_WEBHOOK_URL');

    try {
      if (webhookUrl) {
        const fullUrl = `${webhookUrl}/telegram/webhook`;
        await this.bot?.telegram.setWebhook(fullUrl);
        this.logger.log(`Telegram bot webhook configured at: ${fullUrl}`);
      } else {
        await this.bot?.launch();
        this.logger.log('Telegram bot started in polling mode.');
      }
    } catch (error) {
      this.logger.error(
        'Telegram bot failed to start.',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private registerHandlers() {
    this.bot?.start(async (ctx) => {
      const payload = ctx.payload?.trim();

      if (!payload) {
        await ctx.reply(
          'Please connect your Telegram account from the WeatherGuard website.',
        );
        return;
      }

      const linked = await this.telegramService.linkTelegramAccount(
        payload,
        String(ctx.chat.id),
      );

      if (!linked) {
        await ctx.reply('This connection link is invalid or has expired.');
        return;
      }

      await ctx.reply(
        `✅ Your Telegram account has been connected successfully.

You can now return to the WeatherGuard website and submit your access request.

Once an administrator approves your request, you'll receive a confirmation here and begin receiving weather alerts.`,
      );
    });
  }
}
