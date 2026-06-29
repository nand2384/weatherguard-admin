import type { DashboardStats, User } from '../types';
import { fetchClient } from './apiClient';

export interface GeocodeResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

export const api = {
  getStats: async (): Promise<DashboardStats> => {
    return fetchClient.get<DashboardStats>('/admin/stats');
  },

  getPendingUsers: async (): Promise<User[]> => {
    return fetchClient.get<User[]>('/admin/pending-users');
  },

  getApprovedUsers: async (): Promise<User[]> => {
    return fetchClient.get<User[]>('/admin/approved-users');
  },

  approveUser: async (userId: string): Promise<User> => {
    return fetchClient.patch<User>(`/admin/approve/${userId}`, {});
  },

  rejectUser: async (userId: string): Promise<User> => {
    return fetchClient.patch<User>(`/admin/reject/${userId}`, {});
  },

  getCurrentWeather: async (): Promise<unknown> => {
    return fetchClient.get('/weather/current');
  },

  getForecast: async (): Promise<unknown> => {
    return fetchClient.get('/weather/forecast');
  },

  sendTelegramTestMessage: async (): Promise<{ sent: boolean; message?: string }> => {
    return fetchClient.post('/telegram/test-message');
  },

  sendTelegramWeatherReport: async (): Promise<{ sent: boolean; message?: string }> => {
    return fetchClient.post('/telegram/weather-report');
  },

  searchCities: async (query: string): Promise<GeocodeResult[]> => {
    return fetchClient.get<GeocodeResult[]>(`/weather/geocode?q=${encodeURIComponent(query)}`);
  },
};
