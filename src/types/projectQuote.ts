export interface ProjectQuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category?: 'desarrollo' | 'ia' | 'infraestructura' | 'diseno' | 'integracion' | 'otro';
}

export interface PaymentModeInitialPlusMonthly {
  initialPayment: number;
  monthlyPayment: number;
  minimumMonths: number;
  badgeText: string;
  description: string;
}

export interface PaymentModeOnlyMonthly {
  monthlyPayment: number;
  minimumMonths: number;
  badgeText: string;
  description: string;
}

export interface ProjectQuoteData {
  id: string;
  projectName: string;
  clientName: string;
  clientCompany: string;
  clientWhatsapp: string;
  clientEmail: string;
  date: string;
  validUntilDays: number;
  currency: 'USD' | 'CRC';
  currencySymbol: string;
  notes: string;
  items: ProjectQuoteItem[];
  modeInitialPlusMonthly: PaymentModeInitialPlusMonthly;
  modeOnlyMonthly: PaymentModeOnlyMonthly;
  preferredMode: 'both' | 'initial_plus_monthly' | 'only_monthly';
}
