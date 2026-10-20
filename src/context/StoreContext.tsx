import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PlatformOption, AddonService, Appointment, AppointmentStatus, PricingConfig, PlatformType, BusinessProposal, ProposalStatus } from '../types';
import { api } from '../services/api';

export const DEFAULT_PLATFORMS: PlatformOption[] = [
  {
    id: 'static',
    title: 'Web Estática / Landing Page',
    badge: 'Presencia Rápida',
    description: 'Ideal para marca corporativa, portafolio y máxima velocidad de carga.',
    basePrice: 199,
    features: ['Diseño 100% responsivo', 'Optimización SEO básica', 'Despliegue en Cloudflare']
  },
  {
    id: 'dynamic',
    title: 'Web Dinámica / Catálogo',
    badge: 'Autoadministrable',
    description: 'Ideal para blogs, catálogos, inmobiliarias o actualización frecuente.',
    basePrice: 399,
    features: ['Panel de administración fácil', 'Formularios avanzados', 'Gestión de contenido']
  },
  {
    id: 'ai',
    title: 'Web con Agente de IA 24/7',
    badge: 'Más Popular',
    description: 'Convierte visitas en clientes con chatbots inteligentes y flujos automáticos.',
    basePrice: 599,
    features: ['Chatbot de IA conversacional', 'Captura automática de leads', 'Conexión a WhatsApp / CRM']
  },
  {
    id: 'saas',
    title: 'Plataforma SaaS & Sistema Web',
    badge: 'Solución Enterprise',
    description: 'Software a medida con bases de datos, roles de usuario y pasarelas de pago.',
    basePrice: 999,
    features: ['Arquitectura en la nube', 'Pasarelas SinpePay / Stripe', 'Paneles de usuario avanzados']
  }
];

export const DEFAULT_ADDONS: AddonService[] = [
  {
    id: 'domain',
    title: 'Dominio Propio (.com / .lat)',
    description: 'Registro oficial de tu marca en internet por 1 año.',
    price: 25,
    period: 'anual'
  },
  {
    id: 'hosting',
    title: 'Hosting Cloud Premium',
    description: 'Servidores de alta velocidad con SSL y CDN global.',
    price: 75,
    period: 'anual',
    recommended: true
  },
  {
    id: 'maintenance',
    title: 'Mantenimiento & Soporte Continuo',
    description: 'Actualizaciones de seguridad, monitoreo y soporte prioritario.',
    price: 45,
    period: 'mensual'
  }
];

const DEFAULT_PRICING: PricingConfig = {
  platforms: DEFAULT_PLATFORMS,
  addons: DEFAULT_ADDONS,
  discountPercent: 15,
  discountBanner: '¡Promoción Exclusiva de Temporada!',
  discountActive: false
};

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-1',
    fullName: 'Carlos Morales',
    email: 'carlos@empresa.com',
    whatsapp: '+506 8899-7766',
    service: 'Web con Agente de IA 24/7',
    date: '2026-10-15',
    time: '10:00 AM',
    notes: 'Interesado en conectar chatbot a WhatsApp Business para clínica dental.',
    status: 'confirmada',
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-demo-2',
    fullName: 'Valeria Castro',
    email: 'valeria@hotelboutique.cr',
    whatsapp: '+506 7011-2233',
    service: 'Sistemas de Reservas & Cobros',
    date: '2026-10-18',
    time: '03:30 PM',
    notes: 'Necesita pasarela Sinpe Móvil para reservas de hospedaje.',
    status: 'pendiente',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PROPOSALS: BusinessProposal[] = [
  {
    id: 'prop-demo-1',
    businessName: 'Clínica Dental Sonrisas',
    businessNamesAdditional: 'Sonrisas Kids',
    tagline: 'Odontología integral y diseño de sonrisa avanzado',
    industry: 'Salud & Odontología',
    contactName: 'Dra. Elena Vargas',
    whatsapp: '+506 8877-6655',
    email: 'dra.elena@sonrisasdental.cr',
    location: 'San José, Escazú',
    mainGoal: 'agendar_citas',
    targetAudience: 'Familias y profesionales que buscan tratamientos dentales estéticos e implantes',
    servicesOrProducts: 'Limpieza profunda ($50), Blanqueamiento láser ($180), Ortodoncia invisible ($1,200), Implantes dentales',
    referenceWebsites: 'https://dentalcare.com, https://smiledesign.es',
    aiRole: 'citas',
    aiTone: 'amigable',
    aiCommonFaqs: '¿Aceptan seguros médicos? Sí, Medismart y seguros privados. ¿Cuánto dura la consulta inicial? 45 minutos con radiografía incluida. ¿Hacen emergencias? Sí, atendemos de urgencia el mismo día.',
    aiDestination: 'whatsapp',
    brandColors: 'Azul cielo, Blanco perla y Verde menta',
    socialLinks: '@sonrisasdental.cr en Instagram',
    images: [],
    status: 'nueva',
    createdAt: new Date().toISOString()
  }
];

interface StoreContextType {
  pricing: PricingConfig;
  appointments: Appointment[];
  proposals: BusinessProposal[];
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  isLoginModalOpen: boolean;
  isProposalModalOpen: boolean;
  updatePlatformPrice: (id: PlatformType, newPrice: number) => void;
  updateAddonPrice: (id: string, newPrice: number) => void;
  updateDiscount: (percent: number, active: boolean, banner?: string) => void;
  resetPricing: () => void;
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;
  addProposal: (data: Omit<BusinessProposal, 'id' | 'createdAt' | 'status'> & { id?: string; status?: ProposalStatus }) => Promise<BusinessProposal>;
  updateProposalStatus: (id: string, status: ProposalStatus) => void;
  deleteProposal: (id: string) => void;
  reloadProposals: () => Promise<void>;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openProposalModal: () => void;
  closeProposalModal: () => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load pricing from localStorage
  const [pricing, setPricing] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem('geosoft_pricing');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PRICING;
  });

  // Load appointments from localStorage
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('geosoft_appointments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_APPOINTMENTS;
  });

  // Load proposals from localStorage
  const [proposals, setProposals] = useState<BusinessProposal[]>(() => {
    try {
      const saved = localStorage.getItem('geosoft_proposals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PROPOSALS;
  });

  // Admin auth & modal state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('geosoft_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const isReloadingProposalsRef = useRef(false);

  const reloadProposals = useCallback(async () => {
    if (isReloadingProposalsRef.current) return;
    isReloadingProposalsRef.current = true;
    try {
      const remote = await api.getProposals();
      if (remote && Array.isArray(remote)) {
        setProposals(remote);
      }
    } catch (e) {
      console.error(e);
    } finally {
      isReloadingProposalsRef.current = false;
    }
  }, []);

  // Initial sync with remote Cloudflare D1 backend
  useEffect(() => {
    reloadProposals();

    const timer = setTimeout(() => {
      api.getPricing().then(remotePricing => {
        if (remotePricing) setPricing(remotePricing);
      });
    }, 7000);
    return () => clearTimeout(timer);
  }, [reloadProposals]);

  // Sync proposals & appointments whenever admin panel opens
  useEffect(() => {
    if (isAdminModalOpen) {
      reloadProposals();
      api.getAppointments().then(remoteApts => {
        if (remoteApts) setAppointments(remoteApts);
      });
    }
  }, [isAdminModalOpen, reloadProposals]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem('geosoft_pricing', JSON.stringify(pricing));
    } catch (e) {
      console.error(e);
    }
  }, [pricing]);

  useEffect(() => {
    try {
      localStorage.setItem('geosoft_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('geosoft_proposals', JSON.stringify(proposals));
    } catch (e) {
      console.error(e);
    }
  }, [proposals]);

  const updatePlatformPrice = (id: PlatformType, newPrice: number) => {
    setPricing(prev => {
      const next = {
        ...prev,
        platforms: prev.platforms.map(p => (p.id === id ? { ...p, basePrice: newPrice } : p))
      };
      api.savePricing(next);
      return next;
    });
  };

  const updateAddonPrice = (id: string, newPrice: number) => {
    setPricing(prev => {
      const next = {
        ...prev,
        addons: prev.addons.map(a => (a.id === id ? { ...a, price: newPrice } : a))
      };
      api.savePricing(next);
      return next;
    });
  };

  const updateDiscount = (percent: number, active: boolean, banner?: string) => {
    setPricing(prev => {
      const next = {
        ...prev,
        discountPercent: percent,
        discountActive: active,
        discountBanner: banner !== undefined ? banner : prev.discountBanner
      };
      api.savePricing(next);
      return next;
    });
  };

  const resetPricing = () => {
    setPricing(DEFAULT_PRICING);
    api.savePricing(DEFAULT_PRICING);
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newApt: Appointment = {
      ...data,
      id: 'apt-' + Date.now(),
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    api.createAppointment(newApt);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
    api.updateAppointmentStatus(id, status);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    api.deleteAppointment(id);
  };

  const addProposal = async (data: Omit<BusinessProposal, 'id' | 'createdAt' | 'status'> & { id?: string; status?: ProposalStatus }): Promise<BusinessProposal> => {
    const newProposal: BusinessProposal = {
      ...data,
      id: data.id || `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      status: data.status || 'nueva'
    };
    setProposals(prev => [newProposal, ...prev]);
    try {
      await api.createProposal(newProposal);
    } catch (e) {
      console.error(e);
    }
    return newProposal;
  };

  const updateProposalStatus = (id: string, status: ProposalStatus) => {
    setProposals(prev =>
      prev.map(p => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
    api.updateProposalStatus(id, status);
  };

  const deleteProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
    api.deleteProposal(id);
  };

  const loginAdmin = useCallback((pin: string) => {
    // Default PIN: 2026 or admin2026
    if (pin.trim() === '2026' || pin.trim() === 'admin2026') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('geosoft_admin_auth', 'true');
      setIsLoginModalOpen(false);
      setIsAdminModalOpen(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('geosoft_admin_auth');
    setIsAdminModalOpen(false);
    setIsLoginModalOpen(false);
    if (typeof window !== 'undefined' && (window.location.hash.includes('admin') || window.location.hash.includes('propuestas'))) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const openAdminModal = useCallback(() => {
    const isAuth = sessionStorage.getItem('geosoft_admin_auth') === 'true' || isAdminLoggedIn;
    if (isAuth) {
      setIsAdminModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, [isAdminLoggedIn]);

  const closeAdminModal = useCallback(() => {
    setIsAdminModalOpen(false);
    if (typeof window !== 'undefined' && (window.location.hash.includes('admin') || window.location.hash.includes('propuestas'))) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    if (typeof window !== 'undefined' && (window.location.hash.includes('admin') || window.location.hash.includes('propuestas'))) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, []);

  const openProposalModal = useCallback(() => setIsProposalModalOpen(true), []);
  const closeProposalModal = useCallback(() => setIsProposalModalOpen(false), []);

  return (
    <StoreContext.Provider
      value={{
        pricing,
        appointments,
        proposals,
        isAdminLoggedIn,
        isAdminModalOpen,
        isLoginModalOpen,
        isProposalModalOpen,
        updatePlatformPrice,
        updateAddonPrice,
        updateDiscount,
        resetPricing,
        addAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        addProposal,
        updateProposalStatus,
        deleteProposal,
        reloadProposals,
        openAdminModal,
        closeAdminModal,
        openLoginModal,
        closeLoginModal,
        openProposalModal,
        closeProposalModal,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useGeoSoftStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useGeoSoftStore must be used within a StoreProvider');
  }
  return context;
};
