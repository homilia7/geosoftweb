import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Globe,
  Bot,
  Palette,
  Sparkles,
  Trash2,
  PlusCircle,
  HelpCircle,
  Phone,
  Mail,
  User,
  MapPin,
  Check,
  Send,
  RotateCcw
} from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { ProposalImage, BusinessProposal } from '../types';
import { soundEffects } from '../services/soundEffects';

interface ClientProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Compresor de imagen en canvas para no saturar memoria ni almacenamiento
const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<ProposalImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else if (height > maxWidth) {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            name: file.name,
            type: 'otro',
            dataUrl: e.target?.result as string
          });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        // Detectar si parece un logo por el nombre del archivo
        const isLogo = /logo|marca|icono|isologo/i.test(file.name);

        resolve({
          name: file.name,
          type: isLogo ? 'logo' : 'producto',
          dataUrl: compressedDataUrl
        });
      };
      img.onerror = () => reject(new Error('Error al procesar la imagen'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsDataURL(file);
  });
};

const INITIAL_FORM = {
  businessName: '',
  businessNamesAdditional: '',
  tagline: '',
  industry: 'Servicios Profesionales',
  contactName: '',
  whatsapp: '',
  email: '',
  location: '',
  mainGoal: 'Conseguir clientes potenciales y agendar citas',
  targetAudience: '',
  servicesOrProducts: '',
  referenceWebsites: '',
  budgetOrTimeline: '',
  aiRole: 'ventas',
  aiTone: 'amigable',
  aiCommonFaqs: '',
  aiDestination: 'whatsapp',
  brandColors: '',
  socialLinks: '',
  notes: ''
};

const INDUSTRY_PRESETS = [
  'Salud & Clínicas',
  'Restaurante & Gastronomía',
  'Tienda / E-commerce',
  'Bienes Raíces / Inmobiliaria',
  'Servicios Profesionales',
  'Turismo & Hotelería',
  'Belleza & Spa',
  'Tecnología & SaaS',
  'Educación & Cursos',
  'Construcción & Hogar',
  'Otro Sector'
];

export const ClientProposalModal: React.FC<ClientProposalModalProps> = ({ isOpen, onClose }) => {
  const { addProposal } = useGeoSoftStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState<ProposalImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Escuchar tecla Esc para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      soundEffects.playClick();
      const newImages: ProposalImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const processed = await compressImageFile(file);
          newImages.push(processed);
        }
      }
      setImages(prev => [...prev, ...newImages]);
    } catch (err) {
      console.error(err);
      setErrorMsg('Hubo un problema al procesar algunas imágenes.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    soundEffects.playClick();
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleImageType = (index: number) => {
    soundEffects.playClick();
    setImages(prev =>
      prev.map((img, i) => {
        if (i !== index) return img;
        const types: Array<'logo' | 'producto' | 'referencia' | 'otro'> = ['logo', 'producto', 'referencia', 'otro'];
        const currentIdx = types.indexOf(img.type || 'otro');
        const nextType = types[(currentIdx + 1) % types.length];
        return { ...img, type: nextType };
      })
    );
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.businessName.trim()) {
        setErrorMsg('Por favor ingresa el nombre de tu negocio.');
        return false;
      }
      if (!formData.contactName.trim()) {
        setErrorMsg('Por favor ingresa tu nombre de contacto.');
        return false;
      }
      if (!formData.whatsapp.trim()) {
        setErrorMsg('Por favor ingresa tu número de WhatsApp para contactarte.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.servicesOrProducts.trim()) {
        setErrorMsg('Indica brevemente tus servicios o productos principales.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    soundEffects.playClick();
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    soundEffects.playClick();
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }
    setIsSubmitting(true);
    soundEffects.playClick();

    try {
      await addProposal({
        businessName: formData.businessName.trim(),
        businessNamesAdditional: formData.businessNamesAdditional.trim() || undefined,
        tagline: formData.tagline.trim() || undefined,
        industry: formData.industry,
        contactName: formData.contactName.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim(),
        location: formData.location.trim() || undefined,
        mainGoal: formData.mainGoal,
        targetAudience: formData.targetAudience.trim() || 'Público general',
        servicesOrProducts: formData.servicesOrProducts.trim(),
        referenceWebsites: formData.referenceWebsites.trim() || undefined,
        budgetOrTimeline: formData.budgetOrTimeline.trim() || undefined,
        aiRole: formData.aiRole,
        aiTone: formData.aiTone,
        aiCommonFaqs: formData.aiCommonFaqs.trim(),
        aiDestination: formData.aiDestination,
        brandColors: formData.brandColors.trim() || undefined,
        socialLinks: formData.socialLinks.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        images
      });

      setIsSubmitted(true);
      soundEffects.playSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al enviar. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Requerimiento exacto del usuario: "¿Desea agregar otro negocio? Clic y se abre otro formulario"
  const handleAddAnotherBusiness = () => {
    soundEffects.playClick();
    setFormData(INITIAL_FORM);
    setImages([]);
    setCurrentStep(1);
    setIsSubmitted(false);
    setErrorMsg('');
  };

  const stepsList = [
    { num: 1, title: 'Negocio', icon: Building2 },
    { num: 2, title: 'Sitio Web', icon: Globe },
    { num: 3, title: 'Agente IA', icon: Bot },
    { num: 4, title: 'Imágenes', icon: Palette },
    { num: 5, title: 'Confirmar', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 overflow-y-auto">
      {/* Contenedor Flotante Estilo GeoSoft */}
      <div className="relative w-full max-w-3xl bg-[#0f1115] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(169,248,181,0.15)] border border-white/15 overflow-hidden my-auto max-h-[96vh] flex flex-col animate-message-soft">
        {/* Luz ambiental envolvente */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#A9F8B5]/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#DFF494]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Encabezado Superior */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#14161c]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-bold flex items-center justify-center text-xs shadow-md shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                Ficha de Proyecto & Negocio
                <span className="text-[10px] bg-[#A9F8B5]/15 text-[#A9F8B5] px-2 py-0.5 rounded-full border border-[#A9F8B5]/30 font-mono">
                  Web + Agente IA
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Información esencial para diseñar tu sitio web y entrenar a tu asistente virtual 24/7.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Cerrar (Esc)"
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pantalla de Éxito / Datos Recibidos */}
        {isSubmitted ? (
          <div className="p-6 sm:p-10 flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-message-soft">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] flex items-center justify-center text-black shadow-[0_0_40px_rgba(169,248,181,0.5)]">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-black border border-[#A9F8B5] flex items-center justify-center text-xs">
                ✨
              </span>
            </div>

            <div className="max-w-md space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#A9F8B5]/15 text-[#A9F8B5] text-xs font-mono font-semibold uppercase tracking-wider border border-[#A9F8B5]/30">
                ¡Datos Recibidos con Éxito!
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white pt-2">
                ¡Gracias por confiar en GeoSoft!
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Hemos registrado correctamente la ficha de <strong className="text-[#A9F8B5]">{formData.businessName}</strong>.
                Nuestro equipo revisará los requerimientos, comenzará la arquitectura del sitio web y el entrenamiento de tu agente inteligente.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left max-w-md w-full space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-400">
                <span>WhatsApp de contacto:</span>
                <span className="text-white font-mono">{formData.whatsapp}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Archivos multimedia adjuntos:</span>
                <span className="text-[#A9F8B5] font-semibold">{images.length} imagen(es)</span>
              </div>
            </div>

            {/* Botones de Acción Posterior */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
              {/* Botón expresamente solicitado por el usuario */}
              <button
                onClick={handleAddAnotherBusiness}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>¿Desea agregar otro negocio?</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                Finalizar
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Barra de Progreso y Pasos */}
            <div className="px-4 sm:px-6 py-2.5 bg-[#121418] border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
                {stepsList.map(step => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.num;
                  const isCompleted = currentStep > step.num;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => {
                        if (step.num < currentStep) {
                          soundEffects.playClick();
                          setCurrentStep(step.num);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/40 shadow-sm'
                          : isCompleted
                          ? 'text-gray-400 hover:text-white cursor-pointer'
                          : 'text-gray-600 cursor-default'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                        isCompleted
                          ? 'bg-[#A9F8B5] text-black font-bold'
                          : isActive
                          ? 'bg-[#A9F8B5]/40 text-[#A9F8B5]'
                          : 'bg-white/5 text-gray-500'
                      }`}>
                        {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : step.num}
                      </span>
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-gray-400 shrink-0 pl-2">
                Paso <span className="text-[#A9F8B5] font-bold">{currentStep}</span> de 5
              </div>
            </div>

            {/* Barra de Progreso visual */}
            <div className="w-full bg-white/5 h-1 shrink-0 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>

            {/* Mensaje de Error si hay campos faltantes */}
            {errorMsg && (
              <div className="mx-4 sm:mx-6 mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-message-soft shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Contenido Dinámico por Bloques */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* BLOQUE 1: Identidad del Negocio */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-message-soft">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#A9F8B5]" />
                      Identidad del Negocio (o Negocios)
                    </h3>
                    <p className="text-xs text-gray-400">
                      Datos de marca y contacto principal donde coordinaremos los avances del proyecto.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Nombre oficial del negocio <span className="text-[#A9F8B5]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={e => handleInputChange('businessName', e.target.value)}
                        placeholder="Ej. Clínica Dental Sonrisas / Restaurante Fuego Criollo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                        <span>¿Maneja otros nombres de negocio, marcas o sucursales?</span>
                        <span className="text-[10px] text-gray-500 font-normal">Opcional</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessNamesAdditional}
                        onChange={e => handleInputChange('businessNamesAdditional', e.target.value)}
                        placeholder="Ej. Sucursal Escazú, Marca Secundaria Kids, Tienda Express..."
                        className="w-full px-3.5 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Giro, sector o industria <span className="text-[#A9F8B5]">*</span>
                      </label>
                      <select
                        value={formData.industry}
                        onChange={e => handleInputChange('industry', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#16181e] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors cursor-pointer"
                      >
                        {INDUSTRY_PRESETS.map(ind => (
                          <option key={ind} value={ind} className="bg-[#16181e] text-white">
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Lema o eslogan comercial
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={e => handleInputChange('tagline', e.target.value)}
                        placeholder="Ej. La mejor experiencia gastronómica de la ciudad"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Persona de contacto (Dueño o Administrador) <span className="text-[#A9F8B5]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={e => handleInputChange('contactName', e.target.value)}
                          placeholder="Tu nombre y apellido"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        WhatsApp de contacto <span className="text-[#A9F8B5]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={e => handleInputChange('whatsapp', e.target.value)}
                          placeholder="Ej. +506 8888-9999"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                          placeholder="contacto@tunegocio.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Ubicación física / Ciudad
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={e => handleInputChange('location', e.target.value)}
                          placeholder="Ej. San José, Costa Rica (o 100% digital)"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOQUE 2: Propósito de la Web */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-message-soft">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#A9F8B5]" />
                      Propósito del Sitio Web y Público Objetivo
                    </h3>
                    <p className="text-xs text-gray-400">
                      Definamos la meta comercial y las secciones que necesitará tu plataforma para vender más.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        ¿Cuál es el objetivo principal de la web?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: 'citas', label: 'Conseguir citas y llamadas de clientes' },
                          { id: 'ventas', label: 'Vender productos o servicios directamente' },
                          { id: 'marca', label: 'Prestigio corporativo y portafolio de trabajos' },
                          { id: 'saas', label: 'Sistema interactivo, reservas o membresías' }
                        ].map(goal => (
                          <button
                            key={goal.id}
                            type="button"
                            onClick={() => handleInputChange('mainGoal', goal.label)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              formData.mainGoal === goal.label
                                ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] text-white font-semibold'
                                : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                                formData.mainGoal === goal.label ? 'border-[#A9F8B5] bg-[#A9F8B5]' : 'border-gray-500'
                              }`}>
                                {formData.mainGoal === goal.label && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                              </span>
                              <span>{goal.label}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        ¿Quién es tu cliente ideal o audiencia meta?
                      </label>
                      <input
                        type="text"
                        value={formData.targetAudience}
                        onChange={e => handleInputChange('targetAudience', e.target.value)}
                        placeholder="Ej. Mujeres de 25-50 años interesadas en cuidado de la piel / Empresas que buscan software a medida"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Servicios o productos principales que ofreces <span className="text-[#A9F8B5]">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.servicesOrProducts}
                        onChange={e => handleInputChange('servicesOrProducts', e.target.value)}
                        placeholder="Ej. 1. Consultoría financiera ($100/hora)&#10;2. Auditoría tributaria para pymes&#10;3. Plan de inversión personalizada"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center justify-between">
                        <span>Páginas web que te gusten como referencia o inspiración</span>
                        <span className="text-[10px] text-gray-500">Opcional</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referenceWebsites}
                        onChange={e => handleInputChange('referenceWebsites', e.target.value)}
                        placeholder="Ej. www.apple.com, www.clinicaejemplo.com, o tu web actual si tienes"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOQUE 3: Agente de Inteligencia Artificial */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-message-soft">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#A9F8B5]" />
                      Tu Agente de Inteligencia Artificial (24/7)
                    </h3>
                    <p className="text-xs text-gray-400">
                      Personalizaremos el chatbot que atenderá a tus prospectos mientras duermes o trabajas.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        ¿Qué rol principal tendrá tu agente de IA?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'ventas', label: 'Vendedor', desc: 'Responde dudas y cierra prospectos' },
                          { id: 'citas', label: 'Agendador', desc: 'Consigue fechas y citas' },
                          { id: 'soporte', label: 'Soporte 24/7', desc: 'Atención y dudas técnicas' },
                          { id: 'general', label: 'Asesor Integral', desc: 'Combina ventas y atención' }
                        ].map(role => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => handleInputChange('aiRole', role.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              formData.aiRole === role.id
                                ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] text-white'
                                : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className="font-semibold text-xs text-white">{role.label}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{role.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Tono y personalidad de la conversación
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'amigable', label: 'Amigable & Cercano' },
                          { id: 'formal', label: 'Corporativo & Formal' },
                          { id: 'juvenil', label: 'Enérgico & Dinámico' },
                          { id: 'exclusivo', label: 'Premium & Elegante' }
                        ].map(tone => (
                          <button
                            key={tone.id}
                            type="button"
                            onClick={() => handleInputChange('aiTone', tone.id)}
                            className={`p-2 rounded-xl border text-center text-xs transition-all cursor-pointer ${
                              formData.aiTone === tone.id
                                ? 'bg-gradient-to-r from-[#A9F8B5]/20 to-[#DFF494]/20 border-[#A9F8B5] text-[#A9F8B5] font-semibold'
                                : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {tone.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Preguntas más frecuentes que hacen tus clientes (y sus respuestas)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.aiCommonFaqs}
                        onChange={e => handleInputChange('aiCommonFaqs', e.target.value)}
                        placeholder="Ej:&#10;P: ¿Tienen servicio a domicilio? R: Sí, en toda el área metropolitana.&#10;P: ¿Qué métodos de pago aceptan? R: Sinpe Móvil, tarjetas y transferencias.&#10;P: ¿Cuál es el horario? R: Lunes a Sábado de 8am a 6pm."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors resize-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        ¿Hacia dónde debe canalizar el bot al cliente interesado?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'whatsapp', label: 'Al WhatsApp del dueño' },
                          { id: 'videollamada', label: 'Agendar cita en calendario' },
                          { id: 'pago', label: 'Link de pago directo' }
                        ].map(dest => (
                          <button
                            key={dest.id}
                            type="button"
                            onClick={() => handleInputChange('aiDestination', dest.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                              formData.aiDestination === dest.id
                                ? 'bg-[#A9F8B5]/15 border-[#A9F8B5] text-white font-semibold'
                                : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {dest.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BLOQUE 4: Identidad Visual y Carga de Imágenes */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-message-soft">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#A9F8B5]" />
                      Identidad Visual & Archivos Multimedia
                    </h3>
                    <p className="text-xs text-gray-400">
                      Sube o arrastra el logotipo de tu negocio, fotos de productos, instalaciones o referencias visuales.
                    </p>
                  </div>

                  {/* Zona Drag and Drop para Imágenes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Logotipo y Fotografías del Negocio
                    </label>

                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#A9F8B5] bg-[#A9F8B5]/10 scale-[1.01]'
                          : 'border-white/20 bg-black/30 hover:border-[#A9F8B5]/60 hover:bg-white/5'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFiles(e.target.files)}
                      />

                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A9F8B5]">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-semibold text-white">
                          Arrastra aquí tus imágenes o <span className="text-[#A9F8B5] underline">haz clic para examinar</span>
                        </div>
                        <p className="text-[11px] text-gray-400 max-w-sm">
                          Soporta PNG, JPG, WebP, SVG. Las fotos se optimizan automáticamente sin perder calidad.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Galería de imágenes cargadas */}
                  {images.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          Imágenes cargadas ({images.length})
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          Toca una etiqueta para cambiar entre Logo / Producto / Referencia
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-white/15 bg-black/60 p-1.5 flex flex-col gap-1.5"
                          >
                            <div className="h-24 w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center relative">
                              <img
                                src={img.dataUrl}
                                alt={img.name}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  removeImage(idx);
                                }}
                                title="Eliminar imagen"
                                className="absolute top-1 right-1 p-1 rounded-full bg-black/80 hover:bg-red-500 text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-1 text-[10px]">
                              <span className="text-gray-300 truncate max-w-[80px]" title={img.name}>
                                {img.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleImageType(idx)}
                                className="px-1.5 py-0.5 rounded bg-[#A9F8B5]/20 text-[#A9F8B5] uppercase font-mono font-bold text-[9px] hover:bg-[#A9F8B5]/30 cursor-pointer"
                              >
                                {img.type || 'otro'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colores y Redes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Colores preferidos de la marca
                      </label>
                      <input
                        type="text"
                        value={formData.brandColors}
                        onChange={e => handleInputChange('brandColors', e.target.value)}
                        placeholder="Ej. Verde esmeralda, dorado y negro mate"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Redes sociales existentes
                      </label>
                      <input
                        type="text"
                        value={formData.socialLinks}
                        onChange={e => handleInputChange('socialLinks', e.target.value)}
                        placeholder="Ej. @tunegocio en Instagram, Facebook o TikTok"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOQUE 5: Revisión y Envío */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-message-soft">
                  <div className="border-b border-white/10 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#A9F8B5]" />
                      Revisión de la Ficha del Negocio
                    </h3>
                    <p className="text-xs text-gray-400">
                      Verifica los datos antes de enviarlos. Podrás agregar comentarios o notas adicionales.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Negocio principal:</span>
                      <span className="text-white font-bold text-sm">{formData.businessName || '—'}</span>
                    </div>

                    {formData.businessNamesAdditional && (
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-400">Otras marcas / sucursales:</span>
                        <span className="text-gray-200">{formData.businessNamesAdditional}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-white/5 pb-2">
                      <div>
                        <span className="text-gray-400">Contacto: </span>
                        <span className="text-white font-medium">{formData.contactName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">WhatsApp: </span>
                        <span className="text-[#A9F8B5] font-mono">{formData.whatsapp}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Sector: </span>
                        <span className="text-gray-200">{formData.industry}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Meta Web: </span>
                        <span className="text-gray-200">{formData.mainGoal}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400">Agente de IA configurado:</span>
                      <span className="text-[#A9F8B5] font-medium uppercase font-mono text-[11px]">
                        Rol: {formData.aiRole} • Tono: {formData.aiTone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Archivos adjuntos:</span>
                      <span className="text-white font-semibold">
                        {images.length > 0 ? `${images.length} imágenes listas para enviar` : 'Sin imágenes adjuntas'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      ¿Tienes alguna nota, presupuesto estimado o comentario extra?
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={e => handleInputChange('notes', e.target.value)}
                      placeholder="Ej. Nos gustaría lanzar en 2 semanas / Deseamos integrar pasarela Sinpe Móvil..."
                      className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#A9F8B5] transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Barra Inferior de Navegación de Pasos */}
            <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#121418] shrink-0 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Atrás</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs sm:text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md ml-auto"
                >
                  <span>Siguiente paso</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs sm:text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg ml-auto disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Enviando información...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Información del Negocio</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
