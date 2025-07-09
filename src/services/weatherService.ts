// Weather service to fetch real weather data
export class WeatherService {
  private static readonly API_KEY = 'demo_key'; // In production, use environment variable
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly GEO_URL = 'https://api.openweathermap.org/geo/1.0';

  // Get location name from coordinates
  static async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      // For demo purposes, we'll use a mock reverse geocoding
      // In production, you would use: `${this.GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`
      
      // Mock location data based on coordinates
      if (lat >= 20.5 && lat <= 21.5 && lon >= 105.5 && lon <= 106.5) {
        return 'Hà Nội, Việt Nam';
      } else if (lat >= 10.5 && lat <= 11.0 && lon >= 106.5 && lon <= 107.0) {
        return 'Thành phố Hồ Chí Minh, Việt Nam';
      } else if (lat >= 15.5 && lat <= 16.5 && lon >= 108.0 && lon <= 109.0) {
        return 'Đà Nẵng, Việt Nam';
      } else {
        return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
    }
  }

  // Get current weather by coordinates
  static async getCurrentWeather(lat: number, lon: number) {
    try {
      // For demo purposes, we'll generate realistic weather data based on location
      // In production, you would use: `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=vi`
      
      const locationName = await this.getLocationName(lat, lon);
      
      // Generate realistic weather data based on season and location
      const now = new Date();
      const month = now.getMonth() + 1; // 1-12
      const hour = now.getHours();
      
      // Vietnam weather patterns
      let baseTemp = 28;
      let humidity = 65;
      let condition = 'Partly Cloudy';
      let conditionVi = 'Có mây';
      
      // Seasonal adjustments
      if (month >= 12 || month <= 2) { // Winter
        baseTemp = 22;
        humidity = 70;
      } else if (month >= 6 && month <= 8) { // Summer
        baseTemp = 32;
        humidity = 80;
        if (Math.random() > 0.6) {
          condition = 'Rainy';
          conditionVi = 'Mưa';
        }
      }
      
      // Daily temperature variation
      if (hour >= 6 && hour <= 10) baseTemp -= 3; // Morning
      else if (hour >= 12 && hour <= 16) baseTemp += 2; // Afternoon
      else if (hour >= 18 && hour <= 22) baseTemp -= 1; // Evening
      else baseTemp -= 5; // Night
      
      // Add some randomness
      baseTemp += Math.floor(Math.random() * 6) - 3;
      humidity += Math.floor(Math.random() * 20) - 10;
      
      const weatherData = {
        location: locationName,
        temperature: Math.round(baseTemp),
        condition: condition,
        conditionVi: conditionVi,
        humidity: Math.max(30, Math.min(95, humidity)),
        windSpeed: Math.floor(Math.random() * 15) + 5,
        visibility: Math.floor(Math.random() * 5) + 8,
        pressure: 1013 + Math.floor(Math.random() * 20) - 10,
        uvIndex: hour >= 6 && hour <= 18 ? Math.floor(Math.random() * 8) + 1 : 0,
        feelsLike: Math.round(baseTemp + Math.random() * 6 - 2),
        coordinates: { lat, lon }
      };
      
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // Get 7-day forecast
  static async getForecast(lat: number, lon: number) {
    try {
      // For demo purposes, generate 7-day forecast
      // In production: `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=vi`
      
      const forecast = [];
      const today = new Date();
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        const dayName = i === 0 ? 'Hôm nay' : dayNames[date.getDay()];
        
        // Generate realistic forecast
        const baseTemp = 28 + Math.floor(Math.random() * 8) - 4;
        const conditions = [
          { icon: 'sunny', condition: 'Nắng', conditionEn: 'Sunny' },
          { icon: 'partly-cloudy', condition: 'Có mây', conditionEn: 'Partly Cloudy' },
          { icon: 'cloudy', condition: 'Nhiều mây', conditionEn: 'Cloudy' },
          { icon: 'rainy', condition: 'Mưa', conditionEn: 'Rainy' }
        ];
        
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        forecast.push({
          day: dayName,
          date: date.toLocaleDateString('vi-VN'),
          high: baseTemp + Math.floor(Math.random() * 4),
          low: baseTemp - Math.floor(Math.random() * 8) - 5,
          condition: randomCondition.condition,
          conditionEn: randomCondition.conditionEn,
          icon: randomCondition.icon,
          humidity: 60 + Math.floor(Math.random() * 30),
          windSpeed: 5 + Math.floor(Math.random() * 15)
        });
      }
      
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }
}