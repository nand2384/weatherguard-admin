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
