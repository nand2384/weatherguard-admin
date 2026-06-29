import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Telegraf } from 'telegraf';

import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { WeatherAlert } from '../weather/alert-engine.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TelegramService {
  private readonly bot?: Telegraf;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly weatherService: WeatherService,
  ) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');

    if (botToken) {
      this.bot = new Telegraf(botToken);
    }
  }

  getBot(): Telegraf | undefined {
    return this.bot;
  }

  async generateConnectionLink(userId: string) {
    const token = randomUUID();

    await this.usersService.saveTelegramLinkToken(userId, token);

    return {
      url: `https://t.me/${this.configService.get<string>(
        'TELEGRAM_BOT_USERNAME',
      )}?start=${token}`,
    };
  }

  async linkTelegramAccount(token: string, chatId: string) {
    const user = await this.usersService.findByTelegramLinkToken(token);

    if (!user) {
      return false;
    }

    await this.usersService.markTelegramConnected(user.id, chatId);

    return true;
  }

  async sendApprovalMessage(user: UserDocument) {
    if (!user.telegramChatId) {
      return;
    }

    await this.sendMessage(
      user.telegramChatId,
      `Your WeatherGuard access request has been approved.

You will now begin receiving weather alerts based on your selected alert frequency.`,
    );
  }

  async sendRejectionMessage(user: UserDocument) {
    if (!user.telegramChatId) {
      return;
    }

    await this.sendMessage(
      user.telegramChatId,
      `Your WeatherGuard access request has been rejected.

Please contact support if you believe this was a mistake.`,
    );
  }

  async sendWeatherAlert(chatId: string, alert: WeatherAlert) {
    await this.sendMessage(
      chatId,
      `${alert.title}

${alert.message}

Severity: ${alert.severity.toUpperCase()}`,
    );
  }

  async sendTestMessage(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user?.telegramChatId) {
      return {
        sent: false,
        message: 'Telegram account is not connected.',
      };
    }

    const sent = await this.sendMessage(
      user.telegramChatId,
      'WeatherGuard test message delivered successfully.',
    );

    return {
      sent,
    };
  }

  async sendCurrentWeatherReport(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user?.telegramChatId || typeof user.latitude !== 'number' || typeof user.longitude !== 'number') {
      return {
        sent: false,
        message: 'Telegram account is not connected or location is not set.',
      };
    }

    try {
      const weather: any = await this.weatherService.getCurrentWeather(
        user.latitude,
        user.longitude,
      );

      const temp = Math.round(weather.main?.temp);
      const humidity = weather.main?.humidity;
      const windSpeed = weather.wind?.speed;
      const description = weather.weather?.[0]?.description || 'clear sky';

      const message = `🌤 Current Weather Report for ${user.city}, ${user.country}:

Temp: ${temp}°C
Condition: ${description.charAt(0).toUpperCase() + description.slice(1)}
Humidity: ${humidity}%
Wind Speed: ${windSpeed} m/s

Alerts will be sent dynamically based on your preferences.`;

      const sent = await this.sendMessage(user.telegramChatId, message);
      return {
        sent,
        message: sent ? undefined : 'Failed to send message via Telegram bot.',
      };
    } catch (error) {
      console.error('Failed to send weather report:', error);
      return {
        sent: false,
        message: 'Failed to fetch weather data or send Telegram message.',
      };
    }
  }

  async handleUpdate(update: any) {
    if (!this.bot) {
      return;
    }
    try {
      await this.bot.handleUpdate(update);
    } catch (error) {
      console.error('Error handling Telegram webhook update:', error);
    }
  }

  private async sendMessage(chatId: string, message: string): Promise<boolean> {
    if (!this.bot) {
      return false;
    }

    try {
      await this.bot.telegram.sendMessage(chatId, message);
      return true;
    } catch (error) {
      console.error(`Failed to send Telegram message to ${chatId}:`, error);
      return false;
    }
  }
}
