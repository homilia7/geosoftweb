import React from 'react';
import { X, Calendar } from 'lucide-react';

interface CalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalModal: React.FC<CalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl h-[90vh] md:h-[82vh] bg-[#121315] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/15">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#16181b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm md:text-base">
                Agendar Demostración (30 Min)
              </h3>
              <p className="text-xs text-gray-400">Elige fecha y hora directamente con el equipo de GeoSoft.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Cal.com Iframe */}
        <div className="w-full flex-grow bg-[#090a0b] overflow-hidden">
          <iframe
            src="https://cal.com/geosoft/30min?embed=true&theme=dark"
            title="Agendar Cita GeoSoft"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};
