export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export interface SOSAlert {
  id: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: 'emergency' | 'medical' | 'fire' | 'police';
  status: 'active' | 'resolved' | 'cancelled';
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
  };
  emergencyContacts: EmergencyContact[];
}