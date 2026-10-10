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
