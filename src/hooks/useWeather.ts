import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  conditionVi: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  uvIndex: number;
  feelsLike: number;
  coordinates: { lat: number; lon: number };
}

interface ForecastData {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  conditionEn: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface WeatherState {
  current: WeatherData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
}

export const useWeather = (latitude: number | null, longitude: number | null) => {
  const [weather, setWeather] = useState<WeatherState>({
    current: null,
    forecast: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!latitude || !longitude) {
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'Vị trí không khả dụng'
        }));
        return;
      }

      try {
        setWeather(prev => ({ ...prev, loading: true, error: null }));
        
        const [currentWeather, forecastData] = await Promise.all([
          WeatherService.getCurrentWeather(latitude, longitude),
          WeatherService.getForecast(latitude, longitude)
        ]);

        setWeather({
          current: currentWeather,
          forecast: forecastData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: 'Không thể tải dữ liệu thời tiết'
        }));
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  return weather;
};