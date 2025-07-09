import React, { useState } from 'react';
import { Shield, Phone, MapPin, Github, AlertTriangle, Cloud, Sun, Search } from 'lucide-react';
import { SOSButton } from './components/SOSButton';
import { EmergencyContacts } from './components/EmergencyContacts';
import { LocationDisplay } from './components/LocationDisplay';
import { WeatherDisplay } from './components/WeatherDisplay';
import { DisasterWarningSystem } from './components/DisasterWarningSystem';
import { useGeolocation } from './hooks/useGeolocation';
import { EmergencyContact, SOSAlert } from './types';

function App() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [activeAlert, setActiveAlert] = useState<SOSAlert | null>(null);
  const [activeTab, setActiveTab] = useState<'weather' | 'sos' | 'plant' | 'alert'>('weather');
  const location = useGeolocation();

  // Mock emergency contacts data
  const emergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Cảnh sát 113',
      phone: '113',
      relationship: 'Emergency Services',
      priority: 1
    },
    {
      id: '2',
      name: 'Cứu hỏa 114',
      phone: '114',
      relationship: 'Fire Department',
      priority: 1
    },
    {
      id: '3',
      name: 'Cấp cứu 115',
      phone: '115',
      relationship: 'Medical Emergency',
      priority: 1
    },
    {
      id: '4',
      name: 'Nguyễn Văn A',
      phone: '+84 901 234 567',
      relationship: 'Family Member',
      priority: 2
    }
  ];

  const handleEmergency = () => {
    if (location.latitude && location.longitude) {
      const alert: SOSAlert = {
        id: Date.now().toString(),
        timestamp: new Date(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        type: 'emergency',
        status: 'active'
      };
      
      setActiveAlert(alert);
      setIsEmergencyActive(true);
      
      // Auto-resolve after 30 seconds for demo
      setTimeout(() => {
        setIsEmergencyActive(false);
        setActiveAlert(null);
      }, 30000);
    }
  };

  const handleCall = (contact: EmergencyContact) => {
    window.open(`tel:${contact.phone}`);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background clouds effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-20 bg-white rounded-full blur-sm animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-16 bg-white rounded-full blur-sm animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-24 bg-white rounded-full blur-sm animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Cloud className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Weather & Life</h1>
            </div>
            
            <div className="flex items-center space-x-6 text-white">
              <span className="text-lg font-mono">{getCurrentTime()}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'weather' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Thời tiết
                </button>
                <button
                  onClick={() => setActiveTab('sos')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'sos' 
                      ? 'bg-red-500/80 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  SOS
                </button>
                <button
                  onClick={() => setActiveTab('plant')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'plant' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Cây trồng
                </button>
                <button
                  onClick={() => setActiveTab('alert')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === 'alert' 
                      ? 'bg-white/20 text-white font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Cảnh báo
                </button>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-white/80" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm địa điểm..."
                  className="bg-transparent text-white placeholder-white/60 outline-none text-sm w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Emergency Alert Banner */}
      {isEmergencyActive && (
        <div className="relative z-20 bg-red-600 text-white py-3 px-4 animate-pulse">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">CẢNH BÁO KHẨN CẤP - Đang gửi tín hiệu cứu hộ</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'weather' && (
          <div className="text-center text-white">
            <div className="mb-8">
              <h2 className="text-5xl font-bold mb-4">Theo dõi thời tiết thông minh</h2>
              <p className="text-xl text-white/90 mb-8">Dự báo chính xác - Bảo vệ cuộc sống</p>
              
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Xem thời tiết của bạn
              </button>
              
              <p className="mt-6 text-white/80">
                Phát triển bởi đội: Silent Vision
              </p>
            </div>
            
            <WeatherDisplay />
          </div>
        )}

        {activeTab === 'sos' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - SOS Button */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 text-center border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">Cảnh báo khẩn cấp</h2>
                <SOSButton 
                  onEmergency={handleEmergency}
                  isActive={isEmergencyActive}
                />
                <p className="text-white/80 mt-4 text-sm">
                  Nhấn và giữ để kích hoạt tín hiệu SOS
                </p>
              </div>
            </div>

            {/* Right Column - Emergency Contacts & Location */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                <EmergencyContacts 
                  contacts={emergencyContacts}
                  onCall={handleCall}
                />
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                <LocationDisplay 
                  latitude={location.latitude}
                  longitude={location.longitude}
                  error={location.error}
                  loading={location.loading}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plant' && (
          <div className="text-center text-white">
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-12 border border-white/20">
              <h2 className="text-3xl font-bold mb-4">Quản lý cây trồng thông minh</h2>
              <p className="text-xl text-white/90 mb-8">Theo dõi và chăm sóc cây trồng của bạn</p>
              <div className="text-white/70">
                <p>Tính năng đang được phát triển...</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alert' && (
          <DisasterWarningSystem />
        )}

        {/* Active Alert Details */}
        {activeAlert && (
          <div className="mt-8 bg-red-500/20 backdrop-blur-md border-2 border-red-300/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Cảnh báo khẩn cấp đang hoạt động
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-white/90">
              <div>
                <span className="font-semibold">Mã cảnh báo:</span> {activeAlert.id}
              </div>
              <div>
                <span className="font-semibold">Thời gian:</span> {activeAlert.timestamp.toLocaleString('vi-VN')}
              </div>
              <div>
                <span className="font-semibold">Vị trí:</span> {activeAlert.location.latitude.toFixed(6)}, {activeAlert.location.longitude.toFixed(6)}
              </div>
              <div>
                <span className="font-semibold">Trạng thái:</span> {activeAlert.status.toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/10 backdrop-blur-md text-white py-8 mt-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/80">
              Dịch vụ khẩn cấp 24/7 • Gọi ngay 113 (Công an), 114 (Cứu hỏa), 115 (Cấp cứu)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;