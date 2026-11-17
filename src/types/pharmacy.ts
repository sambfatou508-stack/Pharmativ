export type ScreenId = 'accueil-garde' | 'toutes-les-pharmacies' | 'urgences-samu-tivaouane';

export interface Pharmacy {
  id: string;
  name: string;
  quartier: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  titulaire: string;
  titulaireRole?: string;
  isGardeToday: boolean;
  gardeType?: '24H/24 CONTINUE' | 'NATIONALE TIVAOUANE' | 'AXE RN2' | 'DE GARDE DANS 3 JOURS';
  gardeBadgeText?: string;
  isOpenNow: boolean;
  statusText: string;
  openingHours: string;
  gardeRelieveInfo?: string;
  distanceMeters: number; // in meters
  distanceDisplay: string;
  tags: string[];
  acceptedInsurances: string[];
  hasOxygen: boolean;
  hasVeterinary: boolean;
  hasEmergencySupplies: boolean;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage on SVG map
    mapY: number; // percentage on SVG map
  };
  landmark: string;
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  shortCode?: string;
  phone: string;
  phoneDisplay: string;
  badge: string;
  badgeType: 'national' | 'tivaouane' | 'police' | 'gendarmerie' | 'hospital';
  category: string;
  description: string;
  altPhone?: string;
  altPhoneDisplay?: string;
}

export interface HealthCenter {
  id: string;
  name: string;
  type: string;
  quartier: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  hours: string;
  services: string[];
  is24h: boolean;
}

export interface GuardRotation {
  weekId: string;
  periodLabel: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  pharmacies: {
    pharmacyId: string;
    pharmacyName: string;
    role: string;
    shiftType: '24h/24' | 'Nuit 20h-08h' | 'Week-end';
    phone: string;
  }[];
  eventNote?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  icon: string;
  colorClass: string;
  nePas: string;
  aFaire: string;
  actions: string;
}
