import { Module } from '@nestjs/common';

import { SchedulerService } from './scheduler.service';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [UsersModule, WeatherModule, TelegramModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
