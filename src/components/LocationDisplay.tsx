import React from 'react';
import { MapPin, Navigation, AlertCircle, Globe } from 'lucide-react';

interface LocationDisplayProps {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  latitude,
  longitude,
  error,
  loading
}) => {
  const formatCoordinate = (coord: number | null) => {
    return coord ? coord.toFixed(6) : 'N/A';
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-green-300" />
        Vị trí hiện tại
      </h2>
      
      {loading && (
        <div className="flex items-center space-x-2 text-blue-300 bg-blue-500/20 p-3 rounded-lg border border-blue-300/50">
          <Navigation className="w-4 h-4 animate-spin" />
          <span>Đang xác định vị trí của bạn...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-300 bg-red-500/20 p-3 rounded-lg border border-red-300/50">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {latitude && longitude && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <label className="text-sm font-medium text-white/80 block mb-1">Tọa độ GPS</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-white/60">Vĩ độ</span>
                  <p className="font-mono text-lg text-white">{formatCoordinate(latitude)}</p>
                </div>
                <div>
                  <span className="text-xs text-white/60">Kinh độ</span>
                  <p className="font-mono text-lg text-white">{formatCoordinate(longitude)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                window.open(url, '_blank');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">Google Maps</span>
            </button>
            
            <button
              onClick={() => {
                const coords = `${latitude},${longitude}`;
                navigator.clipboard.writeText(coords);
              }}
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Sao chép</span>
            </button>
          </div>
          
          <div className="bg-green-500/20 border border-green-300/50 rounded-lg p-3">
            <p className="text-white/80 text-sm">
              ✅ <strong>Vị trí đã được xác định</strong> - Thông tin này sẽ được gửi kèm trong tín hiệu SOS
            </p>
          </div>
        </div>
      )}
    </div>
  );
};