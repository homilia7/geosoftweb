import React from 'react';
import { X } from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';

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
        isLight ? 'bg-slate-900/35 backdrop-blur-xl' : 'bg-black/85 backdrop-blur-xl'
      } ${isClosing ? 'animate-backdrop-leave' : 'animate-backdrop-fade'}`}
    >
      <div
        onClick={e => e.stopPropagation()}
        data-theme={theme}
        className={`islamic-glass-card relative w-full max-w-4xl h-[92vh] md:h-[86vh] rounded-[34px] sm:rounded-[38px] shadow-2xl flex flex-col overflow-hidden my-auto ${
          isClosing ? 'animate-modal-leave' : 'animate-modal-drop'
        }`}
      >
        {/* Reflejo Especular Diagonal de Ventana de Cristal */}
        <div className="water-window-sheen" />

        {/* Header con botón cerrar, badge e insignia */}
        <div className="relative pt-5 pb-3 px-6 sm:px-8 text-center shrink-0 z-10">
          <button
            onClick={handleClose}
            className="water-bubble-orb absolute right-5 top-5 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full z-20"
            title="Cerrar ventana"
            aria-label="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="inline-flex items-center justify-center">
            <span className="water-bubble-mini-badge px-4 py-1 text-[10.5px] font-bold tracking-wider uppercase">
              Videollamada Directa 1 a 1
            </span>
          </div>

          <h2
            className={`font-display text-xl sm:text-2xl font-bold tracking-tight mt-1.5 transition-colors ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Agendar Demostración (30 Min)
          </h2>

          <p className={`text-[11px] font-medium tracking-wide mt-1 transition-colors ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
            Cal.com • Sincronización en Tiempo Real
          </p>
        </div>

        {/* Modal Body / Cal.com Iframe */}
        <div className="w-full flex-grow bg-transparent overflow-hidden z-10">
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
