import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Cloud, 
  CloudRain, 
  Zap, 
  Wind, 
  Thermometer, 
  Waves,
  Mountain,
  Shield,
  Bell,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { DisasterService } from '../services/disasterService';

export const DisasterWarningSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const location = useGeolocation();

  useEffect(() => {
    const fetchDisasterData = async () => {
      if (!location.latitude || !location.longitude) return;

      try {
        setLoading(true);
        const [alertsData, riskData] = await Promise.all([
          DisasterService.getActiveAlerts(location.latitude, location.longitude),
          DisasterService.getRiskAnalysis(location.latitude, location.longitude)
        ]);

        setAlerts(alertsData);
        setRiskAnalysis(riskData);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching disaster data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasterData();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchDisasterData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location.latitude, location.longitude]);

  const getDisasterIcon = (type: string, size: string = 'w-6 h-6') => {
    const iconClass = `${size} drop-shadow-lg`;
    
    switch (type.toLowerCase()) {
      case 'flood':
      case 'lũ lụt':
        return <Waves className={`${iconClass} text-blue-400`} />;
      case 'storm':
      case 'bão':
        return <Wind className={`${iconClass} text-gray-400`} />;
      case 'thunderstorm':
      case 'dông':
        return <Zap className={`${iconClass} text-yellow-400`} />;
      case 'heavy_rain':
      case 'mưa lớn':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case 'heat_wave':
      case 'nắng nóng':
        return <Thermometer className={`${iconClass} text-red-400`} />;
      case 'landslide':
      case 'sạt lở':
        return <Mountain className={`${iconClass} text-orange-400`} />;
      default:
        return <AlertTriangle className={`${iconClass} text-yellow-400`} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'extreme':
      case 'cực kỳ nguy hiểm':
        return 'bg-red-600/20 border-red-400/50 text-red-200';
      case 'severe':
      case 'nguy hiểm':
        return 'bg-orange-600/20 border-orange-400/50 text-orange-200';
      case 'moderate':
      case 'trung bình':
        return 'bg-yellow-600/20 border-yellow-400/50 text-yellow-200';
      case 'minor':
      case 'nhẹ':
        return 'bg-blue-600/20 border-blue-400/50 text-blue-200';
      default:
        return 'bg-gray-600/20 border-gray-400/50 text-gray-200';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Cực cao', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (score >= 60) return { level: 'Cao', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (score >= 40) return { level: 'Trung bình', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (score >= 20) return { level: 'Thấp', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    return { level: 'Rất thấp', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  if (loading) {
    return (
      <div className="text-center text-white">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-12 border border-white/20">
          <RefreshCw className="w-12 h-12 text-white/60 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Đang phân tích rủi ro thiên tai...</h2>
          <p className="text-white/80">Đang thu thập dữ liệu từ các nguồn khí tượng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with last update */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Shield className="w-8 h-8 mr-3 text-red-400" />
          Hệ thống cảnh báo thiên tai
        </h2>
        <div className="text-white/70 text-sm flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>Cập nhật: {lastUpdate.toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-400" />
            Cảnh báo hiện tại ({alerts.length})
          </h3>
          {location.latitude && location.longitude && (
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</span>
            </div>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Không có cảnh báo nào</h4>
            <p className="text-white/70">Khu vực của bạn hiện tại an toàn</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 backdrop-blur-sm ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getDisasterIcon(alert.type, 'w-8 h-8')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-lg">{alert.title}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-3 opacity-90">{alert.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-semibold">Thời gian:</span> {alert.startTime} - {alert.endTime}
                      </div>
                      <div>
                        <span className="font-semibold">Khu vực:</span> {alert.area}
                      </div>
                      <div>
                        <span className="font-semibold">Nguồn:</span> {alert.source}
                      </div>
                      <div>
                        <span className="font-semibold">Độ tin cậy:</span> {alert.confidence}%
                      </div>
                    </div>
                    {alert.recommendations && (
                      <div className="mt-3 p-3 bg-white/10 rounded-lg">
                        <h5 className="font-semibold mb-1">Khuyến nghị:</h5>
                        <ul className="text-xs space-y-1">
                          {alert.recommendations.map((rec: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-yellow-400">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Risk Analysis */}
      {riskAnalysis && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Risk Score */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Đánh giá rủi ro tổng thể
            </h3>
            
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getRiskLevel(riskAnalysis.overallScore).bg} mb-4`}>
                <span className={`text-2xl font-bold ${getRiskLevel(riskAnalysis.overallScore).color}`}>
                  {riskAnalysis.overallScore}
                </span>
              </div>
              <div className={`text-lg font-semibold ${getRiskLevel(riskAnalysis.overallScore).color}`}>
                {getRiskLevel(riskAnalysis.overallScore).level}
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(riskAnalysis.factors).map(([factor, score]: [string, any]) => (
                <div key={factor} className="flex items-center justify-between">
                  <span className="text-white/80 capitalize">{factor.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${score >= 70 ? 'bg-red-400' : score >= 40 ? 'bg-yellow-400' : 'bg-green-400'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-white text-sm w-8">{score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Data */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-green-400" />
              Lịch sử thiên tai (30 ngày)
            </h3>
            
            <div className="space-y-4">
              {riskAnalysis.historicalEvents.map((event: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                  {getDisasterIcon(event.type, 'w-5 h-5')}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{event.name}</span>
                      <span className="text-white/60 text-sm">{event.date}</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      Mức độ: {event.severity} • Thithiệt hại: {event.impact}
                    </div>
                  </div>
                </div>
              ))}
              
              {riskAnalysis.historicalEvents.length === 0 && (
                <div className="text-center py-4 text-white/70">
                  Không có sự kiện thiên tai nào trong 30 ngày qua
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Preparedness Tips */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Hướng dẫn ứng phó khẩn cấp
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              type: 'Lũ lụt',
              icon: 'flood',
              tips: [
                'Di chuyển đến nơi cao hơn',
                'Tránh xa dòng nước chảy',
                'Chuẩn bị đồ dùng thiết yếu',
                'Theo dõi thông tin cảnh báo'
              ]
            },
            {
              type: 'Bão',
              icon: 'storm',
              tips: [
                'Gia cố nhà cửa',
                'Dự trữ thực phẩm và nước',
                'Tránh ra ngoài khi bão đổ bộ',
                'Chuẩn bị đèn pin và pin dự phòng'
              ]
            },
            {
              type: 'Sạt lở đất',
              icon: 'landslide',
              tips: [
                'Tránh xa khu vực dốc',
                'Quan sát các dấu hiệu bất thường',
                'Di tản khi có cảnh báo',
                'Không xây dựng gần sườn núi'
              ]
            }
          ].map((guide, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                {getDisasterIcon(guide.icon, 'w-5 h-5')}
                <h4 className="font-semibold text-white">{guide.type}</h4>
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {guide.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts for Disasters */}
      <div className="bg-red-500/20 backdrop-blur-md rounded-xl shadow-lg p-6 border border-red-300/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
          Số điện thoại khẩn cấp
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">113</div>
            <div className="text-white/80">Công an - Cứu hộ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">114</div>
            <div className="text-white/80">Cứu hỏa</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">115</div>
            <div className="text-white/80">Cấp cứu y tế</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-red-300/30 text-center">
          <p className="text-white/80 text-sm">
            🚨 Trong trường hợp khẩn cấp, hãy gọi ngay các số trên hoặc sử dụng nút SOS
          </p>
        </div>
      </div>
    </div>
  );
};