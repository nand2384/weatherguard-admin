import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';

import { AlertFrequency } from '../common/enums/user.enum';
import { TelegramService } from '../telegram/telegram.service';
import { UsersService } from '../users/users.service';
import { AlertEngineService } from '../weather/alert-engine.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
    private readonly alertEngineService: AlertEngineService,
    private readonly telegramService: TelegramService,
  ) {}

  onModuleInit() {
    cron.schedule('0 * * * *', () => {
      void this.processWeatherAlerts();
    });
  }

  private async processWeatherAlerts() {
    const users = await this.usersService.findApprovedUsersWithTelegram();
    const currentHour = new Date().getHours();

    await Promise.all(
      users
        .filter((user) =>
          this.shouldProcessUser(user.alertFrequency, currentHour),
        )
        .map(async (user) => {
          if (
            typeof user.latitude !== 'number' ||
            typeof user.longitude !== 'number' ||
            !user.telegramChatId
          ) {
            return;
          }

          try {
            const weather = await this.weatherService.getCurrentWeather(
              user.latitude,
              user.longitude,
            );
            const alerts = this.alertEngineService.generateAlerts(weather);
            const deliverableAlerts =
              user.alertFrequency === AlertFrequency.SEVERE_ONLY
                ? alerts.filter((alert) => alert.severity === 'severe')
                : alerts;

            await Promise.all(
              deliverableAlerts.map((alert) =>
                this.telegramService.sendWeatherAlert(user.telegramChatId!, alert),
              ),
            );
          } catch (error) {
            this.logger.error(
              `Failed to process weather alerts for user ${user.id}`,
              error instanceof Error ? error.stack : undefined,
            );
          }
        }),
    );
  }

  async sendImmediateAlerts(user: any) {
    if (
      typeof user.latitude !== 'number' ||
      typeof user.longitude !== 'number' ||
      !user.telegramChatId
    ) {
      return;
    }

    try {
      const weather = await this.weatherService.getCurrentWeather(
        user.latitude,
        user.longitude,
      );
      const alerts = this.alertEngineService.generateAlerts(weather);
      const deliverableAlerts =
        user.alertFrequency === AlertFrequency.SEVERE_ONLY
          ? alerts.filter((alert) => alert.severity === 'severe')
          : alerts;

      if (deliverableAlerts.length > 0) {
        await Promise.all(
          deliverableAlerts.map((alert) =>
            this.telegramService.sendWeatherAlert(user.telegramChatId!, alert),
          ),
        );
        this.logger.log(`Sent ${deliverableAlerts.length} immediate weather alerts to newly approved user: ${user.id}`);
      } else {
        const temp = Math.round(weather.main?.temp);
        const humidity = weather.main?.humidity;
        const windSpeed = weather.wind?.speed;
        const description = weather.weather?.[0]?.description || 'clear sky';

        const reportMessage = `🌤 Current Weather Report for ${user.city}, ${user.country}:

Temp: ${temp}°C
Condition: ${description.charAt(0).toUpperCase() + description.slice(1)}
Humidity: ${humidity}%
Wind Speed: ${windSpeed} m/s

Alerts will be sent dynamically based on your preferences.`;

        await this.telegramService.sendMessage(user.telegramChatId, reportMessage);
        this.logger.log(`No active alerts for newly approved user ${user.id}. Sent initial weather report.`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to process immediate weather alerts for approved user ${user.id}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  private shouldProcessUser(
    alertFrequency: AlertFrequency | undefined,
    currentHour: number,
  ) {
    switch (alertFrequency) {
      case AlertFrequency.EVERY_HOUR:
      case AlertFrequency.SEVERE_ONLY:
        return true;
      case AlertFrequency.EVERY_3_HOURS:
        return currentHour % 3 === 0;
      case AlertFrequency.EVERY_6_HOURS:
        return currentHour % 6 === 0;
      default:
        return false;
    }
  }
}
