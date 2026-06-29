import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { TelegramModule } from './telegram/telegram.module';
import { WeatherModule } from './weather/weather.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [AuthModule, UsersModule, AdminModule, TelegramModule, WeatherModule, SchedulerModule],
})
export class AppModule {}
