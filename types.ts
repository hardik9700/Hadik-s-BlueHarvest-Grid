export enum Sector {
  DASHBOARD = 'Dashboard',
  SOLAR = 'Solar',
  AQUACULTURE = 'Aquaculture',
  AGRICULTURE = 'Agriculture',
  MAP = 'Map Tracker',
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SolarData {
  currentOutputKw: number;
  dailyForecastKwh: number;
  batteryLevelPercent: number;
  panelEfficiency: number;
  isShaded: boolean;
  status: 'Normal' | 'Warning' | 'Fault';
  coordinates: Coordinates;
  driftOffsetMeters: number;
}

export interface AquaData {
  waterTempC: number;
  dissolvedOxygenMgL: number;
  phLevel: number;
  turbidityNtu: number;
  fishBiomassKg: number;
  growthRatePercent: number;
  coordinates: Coordinates;
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface AgriData {
  soilMoisturePercent: number;
  nutrientLevelPpm: number;
  growthStage: string;
  irrigationActive: boolean;
  coordinates: Coordinates;
}

export interface SystemState {
  timestamp: number;
  solar: SolarData[];
  aqua: AquaData[];
  agri: AgriData[];
}

export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
  sector: 'Solar' | 'Aqua' | 'Agri' | 'System';
}