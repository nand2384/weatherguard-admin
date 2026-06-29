import { Injectable } from '@nestjs/common';

export interface WeatherAlert {
  type: string;
  title: string;
  message: string;
  severity: 'moderate' | 'severe';
}

interface CurrentWeatherInput {
  name?: string;
  main?: {
    temp?: number;
  };
  wind?: {
    speed?: number;
  };
  weather?: Array<{
    main?: string;
    description?: string;
  }>;
}

@Injectable()
export class AlertEngineService {
  generateAlerts(currentWeather: CurrentWeatherInput): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    const city = currentWeather.name || 'your area';
    const condition = currentWeather.weather?.[0];
    const main = condition?.main?.toLowerCase() || '';
    const description = condition?.description || condition?.main || 'weather';
    const temperature = currentWeather.main?.temp;
    const windSpeed = currentWeather.wind?.speed;

    if (main.includes('thunderstorm')) {
      alerts.push({
        type: 'THUNDERSTORM',
        title: 'Thunderstorm Alert',
        message: `Thunderstorm conditions are expected in ${city}: ${description}.`,
        severity: 'severe',
      });
    }

    if (main.includes('rain') && description.toLowerCase().includes('heavy')) {
      alerts.push({
        type: 'HEAVY_RAIN',
        title: 'Heavy Rain Alert',
        message: `Heavy rain is expected in ${city}: ${description}.`,
        severity: 'severe',
      });
    }

    if (typeof windSpeed === 'number' && windSpeed >= 13.9) {
      alerts.push({
        type: 'HIGH_WIND',
        title: 'High Wind Alert',
        message: `High winds are expected in ${city}. Current wind speed is ${windSpeed} m/s.`,
        severity: windSpeed >= 20 ? 'severe' : 'moderate',
      });
    }

    if (typeof temperature === 'number' && (temperature >= 40 || temperature <= 0)) {
      alerts.push({
        type: 'EXTREME_TEMPERATURE',
        title: 'Extreme Temperature Alert',
        message: `Extreme temperature detected in ${city}. Current temperature is ${temperature} C.`,
        severity: 'severe',
      });
    }

    if (['tornado', 'squall', 'ash', 'dust', 'sand'].some((term) => main.includes(term))) {
      alerts.push({
        type: 'SEVERE_WEATHER',
        title: 'Severe Weather Alert',
        message: `Severe weather conditions are present in ${city}: ${description}.`,
        severity: 'severe',
      });
    }

    return alerts;
  }
}
