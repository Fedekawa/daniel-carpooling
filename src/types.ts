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
  { code: '+373', label: '🇲🇩 Moldavia (+373)' },
  { code: '+44', label: '🇬🇧 Reino Unido (+44)' },
  { code: '+33', label: '🇫🇷 Francia (+33)' },
  { code: '+49', label: '🇩🇪 Alemania (+49)' },
  { code: '+39', label: '🇮🇹 Italia (+39)' },
  { code: '+351', label: '🇵🇹 Portugal (+351)' },
  { code: '+55', label: '🇧🇷 Brasil (+55)' },
  { code: '+598', label: '🇺🇾 Uruguay (+598)' },
  { code: '+595', label: '🇵🇾 Paraguay (+595)' },
  { code: '+591', label: '🇧🇴 Bolivia (+591)' },
  { code: '+58', label: '🇻🇪 Venezuela (+58)' },
  { code: '+502', label: '🇬🇹 Guatemala (+502)' },
  { code: '+503', label: '🇸🇻 El Salvador (+503)' },
  { code: '+504', label: '🇭🇳 Honduras (+504)' },
  { code: '+505', label: '🇳🇮 Nicaragua (+505)' },
  { code: '+53', label: '🇨🇺 Cuba (+53)' },
  { code: '+31', label: '🇳🇱 Países Bajos (+31)' },
  { code: '+41', label: '🇨🇭 Suiza (+41)' },
  { code: '+32', label: '🇧🇪 Bélgica (+32)' },
  { code: '+46', label: '🇸🇪 Suecia (+46)' },
  { code: '+47', label: '🇳🇴 Noruega (+47)' },
  { code: '+45', label: '🇩🇰 Dinamarca (+45)' },
  { code: '+353', label: '🇮🇪 Irlanda (+353)' },
  { code: '+61', label: '🇦🇺 Australia (+61)' },
  { code: '+64', label: '🇳🇿 Nueva Zelanda (+64)' },
  { code: '+81', label: '🇯🇵 Japón (+81)' },
  { code: '+82', label: '🇰🇷 Corea del Sur (+82)' },
  { code: '+91', label: '🇮🇳 India (+91)' },
  { code: '+86', label: '🇨🇳 China (+86)' },
  { code: '+972', label: '🇮🇱 Israel (+972)' },
  { code: '+971', label: '🇦🇪 Emiratos Árabes (+971)' },
  { code: '+966', label: '🇸🇦 Arabia Saudita (+966)' },
  { code: '+27', label: '🇿🇦 Sudáfrica (+27)' },
  { code: '+48', label: '🇵🇱 Polonia (+48)' },
  { code: '+43', label: '🇦🇹 Austria (+43)' },
  { code: '+30', label: '🇬🇷 Grecia (+30)' },
  { code: '+90', label: '🇹🇷 Turquía (+90)' },
  { code: '+7', label: '🇷🇺 Rusia (+7)' },
  { code: '+380', label: '🇺🇦 Ucrania (+380)' },
  { code: '+40', label: '🇷🇴 Rumanía (+40)' },
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
