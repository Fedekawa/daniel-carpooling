export type Direction = 'to_pereira' | 'from_pereira';

export interface Passenger {
  id: string;          // ID de dispositivo/usuario local
  name: string;
  phone: string;       // Formato E.164 o internacional con código de país
  reservedAt: string;  // Cadena ISO
  spotsCount?: number; // Número de cupos reservados (por defecto 1)
  companionNames?: string; // Opcional: "Esposa e hijo", "Ana y Carlos"
}

export interface Trip {
  id: string;
  driverName: string;
  driverPhone: string;
  direction: Direction;
  originCity: string;
  destinationCity: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:MM (formato 24h)
  pickupLocation: string;
  totalSpots: number;
  availableSpots: number;
  notes?: string;
  passengers: Passenger[];
  createdAt: string;
  driverDeviceId: string; // ID único para gestión por el conductor
}

export interface UserProfile {
  deviceId: string;
  name: string;
  phone: string;
  countryCode: string; // ej. "+57"
}

export interface TripFilter {
  direction: 'all' | Direction;
  city: string; // 'todas' o nombre de ciudad
  onlyWithSpots: boolean; // true = mostrar únicamente carros con cupos libres (> 0)
}

export const COUNTRY_CODES = [
  { code: '+57', label: '🇨🇴 Colombia (+57)' },
  { code: '+1', label: '🇺🇸 EE.UU. / Canadá (+1)' },
  { code: '+34', label: '🇪🇸 España (+34)' },
  { code: '+52', label: '🇲🇽 México (+52)' },
  { code: '+54', label: '🇦🇷 Argentina (+54)' },
  { code: '+56', label: '🇨🇱 Chile (+56)' },
  { code: '+51', label: '🇵🇪 Perú (+51)' },
  { code: '+593', label: '🇪🇨 Ecuador (+593)' },
  { code: '+506', label: '🇨🇷 Costa Rica (+506)' },
  { code: '+507', label: '🇵🇦 Panamá (+507)' },
];

export const CITIES = [
  'Bogotá',
  'Armenia',
  'Cali',
  'Medellín',
  'Manizales',
  'Cartagena',
  'Otra'
];
