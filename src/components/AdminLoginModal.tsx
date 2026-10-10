import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle } from 'lucide-react';
import { useGeoSoftStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAdmin } = useGeoSoftStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pin);
    if (!success) {
      setError(true);
    } else {
      setError(false);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-sm bg-[#121316] rounded-3xl shadow-2xl border border-white/15 p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#A9F8B5]/15 border border-[#A9F8B5]/30 flex items-center justify-center text-[#A9F8B5]">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-white text-base">Panel de Administración</h3>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#DFF494]" />
              PIN o Clave de Acceso
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="Ingresa PIN (ej. 2026)"
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#090a0c] border border-white/15 focus:border-[#A9F8B5] text-white text-center text-lg tracking-widest outline-none"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorrecto. Intenta con 2026 o admin2026.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary-gradient py-3 text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Ingresar al Panel
          </button>
        </form>

        <div className="text-[11px] text-gray-500 text-center">
          Acceso exclusivo para el administrador de GeoSoft.
        </div>
      </div>
    </div>
  );
};
