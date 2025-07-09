import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, Eye, Gauge, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';

export const WeatherDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useGeolocation();
  const weather = useWeather(location.latitude, location.longitude);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition: string, size: string = 'w-16 h-16') => {
    const iconClass = `${size} drop-shadow-lg`;
    
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'nắng':
        return <Sun className={`${iconClass} text-yellow-300`} />;
      case 'partly cloudy':
      case 'có mây':
        return <Cloud className={`${iconClass} text-white`} />;
      case 'cloudy':
      case 'nhiều mây':
        return <Cloud className={`${iconClass} text-gray-300`} />;
      case 'rainy':
      case 'mưa':
        return <CloudRain className={`${iconClass} text-blue-300`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-300`} />;
    }
  };

  const getForecastIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-300" />;
      case 'partly-cloudy':
        return <Cloud className="w-6 h-6 text-white" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-300" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-300" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-300" />;
    }
  };

  if (location.loading) {
    return (
      <div className="text-center text-white">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-12 border border-white/20">
          <RefreshCw className="w-12 h-12 text-white/60 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Đang xác định vị trí...</h2>
          <p className="text-white/80">Vui lòng cho phép truy cập vị trí để xem thời tiết địa phương</p>
        </div>
      </div>
    );
  }

  if (location.error) {
    return (
      <div className="text-center text-white">
        <div className="bg-red-500/20 backdrop-blur-md rounded-xl shadow-lg p-12 border border-red-300/50">
          <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không thể xác định vị trí</h2>
          <p className="text-white/80 mb-4">{location.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (weather.loading) {
    return (
      <div className="text-center text-white">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-12 border border-white/20">
          <RefreshCw className="w-12 h-12 text-white/60 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Đang tải thời tiết...</h2>
          <p className="text-white/80">Đang lấy dữ liệu thời tiết cho vị trí của bạn</p>
        </div>
      </div>
    );
  }

  if (weather.error || !weather.current) {
    return (
      <div className="text-center text-white">
        <div className="bg-red-500/20 backdrop-blur-md rounded-xl shadow-lg p-12 border border-red-300/50">
          <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Lỗi tải thời tiết</h2>
          <p className="text-white/80 mb-4">{weather.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const weatherData = weather.current;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {/* Main Weather Card */}
      <div className="md:col-span-2 lg:col-span-2 bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-green-300" />
              <h3 className="text-2xl font-bold text-white">{weatherData.location}</h3>
            </div>
            <p className="text-white/80">{currentTime.toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          {getWeatherIcon(weatherData.conditionVi)}
        </div>
        
        <div className="flex items-end space-x-4 mb-6">
          <span className="text-6xl font-bold text-white">{weatherData.temperature}°</span>
          <div className="text-white/80 pb-2">
            <p className="text-lg">{weatherData.conditionVi}</p>
            <p className="text-sm">Cảm giác như {weatherData.feelsLike}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 text-white/80">
            <Droplets className="w-4 h-4" />
            <span className="text-sm">Độ ẩm: {weatherData.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Wind className="w-4 h-4" />
            <span className="text-sm">Gió: {weatherData.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Tầm nhìn: {weatherData.visibility} km</span>
          </div>
          <div className="flex items-center space-x-2 text-white/80">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Áp suất: {weatherData.pressure} hPa</span>
          </div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Thermometer className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold">Nhiệt độ</span>
          </div>
          <div className="text-2xl font-bold text-white">{weatherData.temperature}°C</div>
          <div className="text-white/70 text-sm">Cảm giác như {weatherData.feelsLike}°C</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Sun className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">Chỉ số UV</span>
          </div>
          <div className="text-2xl font-bold text-white">{weatherData.uvIndex}</div>
          <div className="text-white/70 text-sm">Trung bình</div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-3">
            <Wind className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Gió</span>
          </div>
          <div className="text-2xl font-bold text-white">{weatherData.windSpeed}</div>
          <div className="text-white/70 text-sm">km/h</div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h4 className="text-xl font-bold text-white mb-4">Dự báo 7 ngày</h4>
        <div className="grid grid-cols-7 gap-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-white/80 text-sm mb-2 font-medium">{day.day}</div>
              <div className="flex justify-center mb-2">
                {getForecastIcon(day.icon)}
              </div>
              <div className="text-white font-semibold text-sm">{day.high}°</div>
              <div className="text-white/60 text-xs">{day.low}°</div>
              <div className="text-white/50 text-xs mt-1">{day.condition}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>Vị trí: {weatherData.coordinates.lat.toFixed(4)}°, {weatherData.coordinates.lon.toFixed(4)}°</span>
            </div>
            <span>•</span>
            <span>Cập nhật: {currentTime.toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};