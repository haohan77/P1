import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Shield } from 'lucide-react';

interface SOSButtonProps {
  onEmergency: () => void;
  isActive: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ onEmergency, isActive }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handlePress = () => {
    if (isActive) return;
    
    setIsPressed(true);
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPressed(false);
          onEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRelease = () => {
    setIsPressed(false);
    setCountdown(0);
  };

  // P1 SOS functionality integration
  const triggerP1SOS = () => {
    // Simulate P1's SOS features
    console.log('P1 SOS Features Activated:');
    console.log('- Sending location to emergency contacts');
    console.log('- Activating emergency protocols');
    console.log('- Recording emergency data');
    
    // Additional P1 features can be added here
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const sosData = {
          timestamp: new Date().toISOString(),
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          emergencyType: 'general',
          deviceInfo: navigator.userAgent,
          batteryLevel: 'unknown' // Would need battery API
        };
        
        console.log('P1 SOS Data Package:', sosData);
        
        // In real implementation, this would send to P1's backend
        localStorage.setItem('p1_sos_data', JSON.stringify(sosData));
      });
    }
  };

  const handleEmergencyActivation = () => {
    onEmergency();
    triggerP1SOS(); // Integrate P1 functionality
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        disabled={isActive}
        onClick={handleEmergencyActivation}
        className={`
          relative w-48 h-48 rounded-full border-8 transition-all duration-200
          ${isActive 
            ? 'bg-red-600 border-red-700 animate-pulse shadow-red-500/50' 
            : isPressed 
              ? 'bg-red-500 border-red-600 scale-95 shadow-red-500/70' 
              : 'bg-red-500 border-red-600 hover:bg-red-400 hover:scale-105 active:scale-95 hover:shadow-red-500/50'
          }
          shadow-2xl flex items-center justify-center
        `}
      >
        <div className="text-center">
          <div className="relative">
            <Shield className="w-16 h-16 text-white mb-2 mx-auto" />
            {isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
              </div>
            )}
          </div>
          <span className="text-white font-bold text-xl">
            {isActive ? 'ĐANG GỬI' : isPressed ? countdown : 'SOS'}
          </span>
          {isActive && (
            <div className="text-white/80 text-sm mt-1">P1 ACTIVE</div>
          )}
        </div>
        
        {isPressed && (
          <div className="absolute inset-0 rounded-full border-4 border-white animate-ping" />
        )}
        
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse" />
            <div className="absolute -inset-4 rounded-full border-2 border-red-300 animate-ping" />
          </>
        )}
      </button>
      
      <div className="text-center">
        <p className="text-white/90 font-medium">
          {isActive 
            ? 'Tín hiệu SOS đang được gửi...' 
            : 'Nhấn và giữ để kích hoạt SOS'
          }
        </p>
        {isActive && (
          <div className="mt-2 text-white/70 text-sm">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Đang gọi</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Gửi vị trí</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Ghi nhận</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};