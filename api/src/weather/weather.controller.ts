import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { UsersService } from '../users/users.service';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly usersService: UsersService,
  ) {}

  @Get('current')
  async getCurrentWeather(@Req() req: Request) {
    const user = await this.usersService.findById(req.user.id);

    return this.weatherService.getCurrentWeatherForUser(user);
  }

  @Get('forecast')
  async getForecast(@Req() req: Request) {
    const user = await this.usersService.findById(req.user.id);

    return this.weatherService.getForecastForUser(user);
  }

  @Get('geocode')
  async geocodeCity(@Query('q') query: string) {
    return this.weatherService.geocodeCity(query);
  }
}
