export type PlatformType = 'static' | 'dynamic' | 'ai' | 'saas';

export interface PlatformOption {
  id: PlatformType;
  title: string;
  badge: string;
  description: string;
  basePrice: number;
  features: string[];
}

export interface AddonService {
  id: string;
  title: string;
  description: string;
  price: number;
  period: 'pago único' | 'mensual' | 'anual';
  recommended?: boolean;
}

export interface QuoteState {
  platform: PlatformType;
  selectedAddons: string[];
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface PricingConfig {
  platforms: PlatformOption[];
  addons: AddonService[];
  discountPercent: number; // e.g. 15 for 15% off
  discountBanner: string; // e.g. "¡Promoción de Lanzamiento!"
  discountActive: boolean;
}
