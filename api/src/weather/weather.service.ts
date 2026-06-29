import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class WeatherService {
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private readonly configService: ConfigService) {}

  async getCurrentWeather(latitude: number, longitude: number) {
    return this.requestOpenWeather('/weather', latitude, longitude);
  }

  async getForecast(latitude: number, longitude: number) {
    return this.requestOpenWeather('/forecast', latitude, longitude);
  }

  async getCurrentWeatherForUser(user: UserDocument | null) {
    const { latitude, longitude } = this.getUserCoordinates(user);

    return this.getCurrentWeather(latitude, longitude);
  }

  async geocodeCity(query: string) {
    if (!query) {
      return [];
    }
    const apiKey =
      this.configService.get<string>('OPENWEATHER_API_KEY') ||
      this.configService.get<string>('WEATHER_API_KEY');

    if (!apiKey) {
      throw new BadRequestException('OpenWeatherMap API key is not configured.');
    }

    const url = new URL(`https://api.openweathermap.org/geo/1.0/direct`);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '5');
    url.searchParams.set('appid', apiKey);

    const response = await fetch(url);
    if (!response.ok) {
      throw new BadRequestException('Unable to fetch geocode data.');
    }

    return response.json();
  }

  async getForecastForUser(user: UserDocument | null) {
    const { latitude, longitude } = this.getUserCoordinates(user);

    return this.getForecast(latitude, longitude);
  }

  private getUserCoordinates(user: UserDocument | null) {
    if (
      !user ||
      typeof user.latitude !== 'number' ||
      typeof user.longitude !== 'number'
    ) {
      throw new BadRequestException('Complete your profile location first.');
    }

    return {
      latitude: user.latitude,
      longitude: user.longitude,
    };
  }

  private async requestOpenWeather(
    path: '/weather' | '/forecast',
    latitude: number,
    longitude: number,
  ) {
    const apiKey =
      this.configService.get<string>('OPENWEATHER_API_KEY') ||
      this.configService.get<string>('WEATHER_API_KEY');

    if (!apiKey) {
      throw new BadRequestException('OpenWeatherMap API key is not configured.');
    }

    const url = new URL(`${this.baseUrl}${path}`);

    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));
    url.searchParams.set('appid', apiKey);
    url.searchParams.set('units', 'metric');

    const response = await fetch(url);

    if (!response.ok) {
      throw new BadRequestException('Unable to fetch weather data.');
    }

    return response.json();
  }
}
