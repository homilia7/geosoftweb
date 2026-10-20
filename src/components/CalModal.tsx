import React from 'react';
import { X } from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { IslamicGeometricRibbon } from './IslamicGeometricRibbon';

interface CalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalModal: React.FC<CalModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useGeoSoftStore();
  const isLight = theme === 'light';
  const [isClosing, setIsClosing] = React.useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 460);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none ${
        isLight ? 'bg-stone-900/40 backdrop-blur-md' : 'bg-black/85 backdrop-blur-md'
      } ${isClosing ? 'animate-backdrop-leave' : 'animate-backdrop-fade'}`}
    >
      <div
        onClick={e => e.stopPropagation()}
        data-theme={theme}
        className={`islamic-glass-card relative w-full max-w-4xl h-[92vh] md:h-[86vh] rounded-[34px] sm:rounded-[38px] shadow-2xl flex flex-col overflow-hidden my-auto ${
          isClosing ? 'animate-modal-leave' : 'animate-modal-drop'
        }`}
      >
        {/* Header con botón cerrar, badge e insignia */}
        <div className="relative pt-4 pb-2.5 px-6 sm:px-8 text-center shrink-0">
          <button
            onClick={handleClose}
            className={`absolute right-5 top-4 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center justify-center ${
              isLight
                ? 'bg-black/5 hover:bg-black/10 text-[#3d332a]'
                : 'bg-white/10 hover:bg-white/15 text-gray-200'
            }`}
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center justify-center">
            <span
              className={`px-5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
                isLight ? 'islamic-badge-light' : 'islamic-badge-dark'
              }`}
            >
              Videollamada Directa 1 a 1
            </span>
          </div>

          <h2
            className={`font-display text-xl sm:text-2xl font-bold tracking-tight mt-1.5 transition-colors ${
              isLight ? 'text-[#2c241c]' : 'text-white'
            }`}
          >
            Agendar Demostración (30 Min)
          </h2>
        </div>

        {/* Franja con Patrón Geométrico */}
        <IslamicGeometricRibbon
          theme={theme}
          badgeText="Cal.com • Sincronización en Tiempo Real"
        />

        {/* Modal Body / Cal.com Iframe */}
        <div className="w-full flex-grow bg-transparent overflow-hidden">
          <iframe
            src={`https://cal.com/geosoft/30min?embed=true&theme=${theme}`}
            title="Agendar Cita GeoSoft"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
