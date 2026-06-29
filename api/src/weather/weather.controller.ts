import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { UsersService } from '../users/users.service';
import { WeatherService } from './weather.service';

@Controller('weather')
@UseGuards(SessionAuthGuard)
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly usersService: UsersService,
  ) {}

  @Get('current')
  async getCurrentWeather(@Req() req: Request) {
    const user = await this.usersService.findById(req.session.userId!);

    return this.weatherService.getCurrentWeatherForUser(user);
  }

  @Get('forecast')
  async getForecast(@Req() req: Request) {
    const user = await this.usersService.findById(req.session.userId!);

    return this.weatherService.getForecastForUser(user);
  }

  @Get('geocode')
  async geocodeCity(@Query('q') query: string) {
    return this.weatherService.geocodeCity(query);
  }
}
