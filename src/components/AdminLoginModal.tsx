import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';
import { soundEffects } from '../services/soundEffects';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useGeoSoftStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      soundEffects.playClick();
    } catch {}
    const success = loginAdmin(pin);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPin('');
    }
  };

  const handleBackToWeb = () => {
    try {
      soundEffects.playClick();
    } catch {}
    closeLoginModal();
  };

  return (
    <div className="min-h-screen w-full bg-[#060709] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#A9F8B5] selection:text-black">
      {/* Luces ambientales envolventes */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#A9F8B5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#DFF494]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="tactile-card relative w-full max-w-md bg-[#0d0f14]/90 backdrop-blur-2xl rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pb-2 border-b border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#A9F8B5] to-[#DFF494] text-black font-extrabold flex items-center justify-center text-xl mx-auto shadow-[0_0_25px_rgba(169,248,181,0.35)]">
            GS
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl sm:text-2xl tracking-tight flex items-center justify-center gap-2">
              GeoSoft Admin
              <span className="text-[10px] bg-[#A9F8B5]/20 text-[#A9F8B5] border border-[#A9F8B5]/30 px-2 py-0.5 rounded-full font-mono uppercase">
                Consola
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Espacio independiente de control para propuestas, citas, bot de IA y tarifas.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#DFF494]" />
                PIN de Seguridad Maestro
              </span>
              <span className="text-[10px] font-mono text-gray-500">2026</span>
            </label>

            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="••••"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 focus:border-[#A9F8B5] text-white text-center text-xl tracking-[0.3em] outline-none shadow-inner transition-colors font-mono"
              />
              <div className="absolute right-3.5 top-3.5 text-gray-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1 justify-center animate-message-soft">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>PIN incorrecto. Ingresa el PIN maestro (ej. 2026).</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#A9F8B5] to-[#DFF494] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#A9F8B5]/15"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Ingresar al Workspace</span>
          </button>
        </form>

        {/* Volver a la web */}
        <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleBackToWeb}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 py-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#A9F8B5]" />
            <span>Volver al Sitio Web Principal</span>
          </button>

          <div className="text-[10.5px] text-gray-500 flex items-center gap-1 font-mono">
            <span>Conexión protegida</span>
            <span>•</span>
            <span>Cloudflare D1 Edge</span>
          </div>
        </div>
      </div>
    </div>
  );
};