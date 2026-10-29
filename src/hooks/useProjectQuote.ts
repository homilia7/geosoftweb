import { useState, useEffect, useMemo } from 'react';
import { ProjectQuoteData, ProjectQuoteItem } from '../types/projectQuote';
import { api } from '../services/api';

const STORAGE_KEY = 'geosoft_admin_project_quote_v1';
const QUOTES_STORE_KEY = 'geosoft_quotes_store';

export const encodeQuotePayload = (data: ProjectQuoteData): string => {
  try {
    const json = JSON.stringify(data);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return '';
  }
};

export const decodeQuotePayload = (encoded: string): ProjectQuoteData | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    if (!parsed.exchangeRate) parsed.exchangeRate = 520;
    return parsed;
  } catch {
    return null;
  }
};

export const DEFAULT_QUOTE: ProjectQuoteData = {
  id: 'COT-' + new Date().getFullYear() + '-001',
  projectName: 'Plataforma Web E-Commerce & Agente IA 24/7',
  clientName: 'Cliente Corporativo',
  clientCompany: 'Empresa Demo S.A.',
  clientWhatsapp: '+506 ',
  clientEmail: '',
  date: new Date().toISOString().split('T')[0],
  validUntilDays: 15,
  currency: 'USD',
  currencySymbol: '$',
  exchangeRate: 520,
  notes: 'Incluye despliegue en Cloudflare Pages, certificado SSL de por vida y capacitación remota.',
  items: [
    {
      id: 'item-1',
      name: 'Desarrollo Web Full-Stack & PWA React/Vite',
      description: 'Diseño bimodal exclusivo, responsive, carga en <0.5s y optimización SEO',
      quantity: 1,
      unitPrice: 650,
      category: 'desarrollo'
    },
    {
      id: 'item-2',
      name: 'Agente de Inteligencia Artificial Gemini 24/7',
      description: 'Entrenamiento RAG con catálogo propio, captura de leads y enlace a WhatsApp',
      quantity: 1,
      unitPrice: 350,
      category: 'ia'
    },
    {
      id: 'item-3',
      name: 'Integración de Pasarela de Pagos / SINPE Móvil',
      description: 'Flujo automático de confirmación de comprobantes y notificaciones inmediatas',
      quantity: 1,
      unitPrice: 200,
      category: 'integracion'
    }
  ],
  modeInitialPlusMonthly: {
    initialPayment: 1200,
    monthlyPayment: 65,
    minimumMonths: 12,
    badgeText: 'Opción Híbrida (Recomendada)',
    description: 'Menor cuota mensual. Cubre costos iniciales de desarrollo y licenciamiento.'
  },
  modeOnlyMonthly: {
    monthlyPayment: 165,
    minimumMonths: 12,
    badgeText: 'Opción Cero Desembolso',
    description: 'Sin pago inicial. El costo de desarrollo se amortiza 100% en la cuota mensual.'
  },
  preferredMode: 'both'
};

export const useProjectQuote = () => {
  const [quote, setQuote] = useState<ProjectQuoteData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.exchangeRate) parsed.exchangeRate = 520;
          return parsed;
        }
      } catch {}
    }
    return DEFAULT_QUOTE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
    } catch {}
  }, [quote]);

  const itemsSubtotal = useMemo(() => {
    return quote.items.reduce((sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1), 0);
  }, [quote.items]);

  const updateField = <K extends keyof ProjectQuoteData>(key: K, value: ProjectQuoteData[K]) => {
    setQuote(prev => ({ ...prev, [key]: value }));
  };

  const switchCurrency = (newCurrency: 'USD' | 'CRC', autoConvert: boolean = false) => {
    setQuote(prev => {
      const isCurrentlyUsd = prev.currency === 'USD';
      const toCrc = newCurrency === 'CRC';
      const rate = prev.exchangeRate || 520;
      const symbol = toCrc ? '₡' : '$';

      if (!autoConvert || prev.currency === newCurrency) {
        return { ...prev, currency: newCurrency, currencySymbol: symbol };
      }

      const factor = toCrc ? rate : (1 / rate);
      const roundPrice = (val: number) => {
        if (toCrc) return Math.round((val * factor) / 1000) * 1000;
        return Math.round(val * factor);
      };

      return {
        ...prev,
        currency: newCurrency,
        currencySymbol: symbol,
        items: prev.items.map(it => ({ ...it, unitPrice: roundPrice(it.unitPrice) })),
        modeInitialPlusMonthly: {
          ...prev.modeInitialPlusMonthly,
          initialPayment: roundPrice(prev.modeInitialPlusMonthly.initialPayment),
          monthlyPayment: roundPrice(prev.modeInitialPlusMonthly.monthlyPayment)
        },
        modeOnlyMonthly: {
          ...prev.modeOnlyMonthly,
          monthlyPayment: roundPrice(prev.modeOnlyMonthly.monthlyPayment)
        }
      };
    });
  };

  const addItem = (item?: Partial<ProjectQuoteItem>) => {
    const isCrc = quote.currency === 'CRC';
    const newItem: ProjectQuoteItem = {
      id: 'item-' + Date.now(),
      name: item?.name || 'Nuevo Servicio / Módulo',
      description: item?.description || 'Descripción detallada de los entregables y alcance',
      quantity: item?.quantity || 1,
      unitPrice: item?.unitPrice || (isCrc ? 75000 : 150),
      category: item?.category || 'desarrollo'
    };
    setQuote(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, updates: Partial<ProjectQuoteItem>) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.map(it => (it.id === id ? { ...it, ...updates } : it))
    }));
  };

  const removeItem = (id: string) => {
    setQuote(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  const updateInitialPlusMonthly = (updates: Partial<typeof quote.modeInitialPlusMonthly>) => {
    setQuote(prev => ({
      ...prev,
      modeInitialPlusMonthly: { ...prev.modeInitialPlusMonthly, ...updates }
    }));
  };

  const updateOnlyMonthly = (updates: Partial<typeof quote.modeOnlyMonthly>) => {
    setQuote(prev => ({
      ...prev,
      modeOnlyMonthly: { ...prev.modeOnlyMonthly, ...updates }
    }));
  };

  const syncInitialWithSubtotal = () => {
    updateInitialPlusMonthly({ initialPayment: itemsSubtotal });
  };

  const resetToTemplate = () => {
    setQuote({ ...DEFAULT_QUOTE, id: 'COT-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900) });
  };

  const getClientShareableUrl = () => {
    const cleanId = (quote.id || 'COT-' + Date.now()).trim();

    // 1. Guardar en mapa local
    try {
      const stored = localStorage.getItem(QUOTES_STORE_KEY);
      const map = stored ? JSON.parse(stored) : {};
      map[cleanId] = quote;
      localStorage.setItem(QUOTES_STORE_KEY, JSON.stringify(map));
    } catch {}

    // 2. Guardar en base de datos Cloudflare D1 en segundo plano
    try {
      api.createProposal({
        id: cleanId,
        businessName: quote.projectName,
        contactName: quote.clientName,
        whatsapp: quote.clientWhatsapp,
        email: quote.clientEmail,
        status: 'revisada' as any,
        source: 'web',
        notes: JSON.stringify(quote),
        images: [],
        industry: 'Software & Web',
        mainGoal: quote.projectName,
        targetAudience: quote.clientCompany,
        servicesOrProducts: quote.items.map(it => `${it.name} (x${it.quantity}): ${quote.currencySymbol}${it.unitPrice * it.quantity}`).join(', '),
        aiRole: 'cotizador',
        aiTone: 'formal',
        aiCommonFaqs: '',
        aiDestination: 'admin'
      });
    } catch {}

    // 3. Retornar enlace CORTO y ÚNICO por propuesta
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.geosoft.lat';
    return `${origin}/#cotizacion=${cleanId}`;
  };

  const generateWhatsAppMessage = () => {
    const sym = quote.currencySymbol;
    const clientLink = getClientShareableUrl();
    let msg = `*PROPUESTA COMERCIAL FORMAL — GEOSOFT*\n`;
    msg += `📄 *Proyecto:* ${quote.projectName}\n`;
    msg += `👤 *Cliente:* ${quote.clientName} (${quote.clientCompany || 'N/A'})\n`;
    msg += `📅 *Fecha:* ${quote.date} (Válida por ${quote.validUntilDays} días)\n`;
    msg += `💰 *Moneda:* ${quote.currency === 'CRC' ? 'Colones costarricenses (₡)' : 'Dólares estadounidenses ($)'}\n\n`;
    msg += `*MODALIDADES DE PAGO DISPONIBLES:*\n`;
    msg += `🔹 *Opción 1 (Inicial + Mensual):* ${sym}${quote.modeInitialPlusMonthly.initialPayment.toLocaleString()} inicial + ${sym}${quote.modeInitialPlusMonthly.monthlyPayment.toLocaleString()}/mes\n`;
    msg += `🔹 *Opción 2 (Suscripción Todo Incluido):* ${sym}0 inicial + ${sym}${quote.modeOnlyMonthly.monthlyPayment.toLocaleString()}/mes\n\n`;
    msg += `🌐 *Ver y Aprobar Propuesta Interactiva en Línea:*\n${clientLink}\n\n`;
    msg += `_Emitido por GeoSoft Consultancy & Software Engineering_`;
    return encodeURIComponent(msg);
  };

  return {
    quote,
    itemsSubtotal,
    updateField,
    switchCurrency,
    addItem,
    updateItem,
    removeItem,
    updateInitialPlusMonthly,
    updateOnlyMonthly,
    syncInitialWithSubtotal,
    resetToTemplate,
    getClientShareableUrl,
    generateWhatsAppMessage
  };
};
