import React from 'react';
import { Phone, User, Heart, Shield } from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
  onCall: (contact: EmergencyContact) => void;
}

export const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ contacts, onCall }) => {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-500/20 border-red-300/50 text-white';
      case 2: return 'bg-orange-500/20 border-orange-300/50 text-white';
      case 3: return 'bg-yellow-500/20 border-yellow-300/50 text-white';
      default: return 'bg-white/20 border-white/30 text-white';
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    if (relationship.toLowerCase().includes('family') || relationship.toLowerCase().includes('parent')) {
      return <Heart className="w-4 h-4" />;
    }
    if (relationship.toLowerCase().includes('emergency') || relationship.toLowerCase().includes('police') || relationship.toLowerCase().includes('fire') || relationship.toLowerCase().includes('medical')) {
      return <Shield className="w-4 h-4" />;
    }
    return <User className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Phone className="w-5 h-5 mr-2 text-blue-300" />
        Danh bạ khẩn cấp
      </h2>
      
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md backdrop-blur-sm ${getPriorityColor(contact.priority)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getRelationshipIcon(contact.relationship)}
                <div>
                  <h3 className="font-semibold text-white">{contact.name}</h3>
                  <p className="text-sm text-white/70">{contact.relationship}</p>
                </div>
              </div>
              
              <button
                onClick={() => onCall(contact)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-green-500/25"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi</span>
              </button>
            </div>
            
            <div className="mt-2 text-sm font-mono text-white/90 bg-white/10 rounded px-2 py-1 inline-block">
              {contact.phone}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/20 border border-blue-300/50 rounded-lg">
        <p className="text-white/80 text-sm">
          💡 <strong>Lưu ý:</strong> Trong trường hợp khẩn cấp, hãy gọi ngay số điện thoại cứu hộ 113, 114, 115
        </p>
      </div>
    </div>
  );
};