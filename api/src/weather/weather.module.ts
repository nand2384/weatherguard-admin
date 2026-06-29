import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AlertEngineService } from './alert-engine.service';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, UsersModule],
  controllers: [WeatherController],
  providers: [WeatherService, AlertEngineService],
  exports: [WeatherService, AlertEngineService],
})
export class WeatherModule {}
