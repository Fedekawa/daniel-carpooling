import React, { useState, useEffect } from 'react';
import { UserProfile, COUNTRY_CODES } from '../types';
import { User, Phone, Check, Heart, Sparkles, X } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
  isFirstTime?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentProfile,
  isFirstTime = false
}) => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name);
      setCountryCode(currentProfile.countryCode || '+57');
      // Extraer solo dígitos del teléfono
      const cleanPhone = currentProfile.phone.replace(currentProfile.countryCode || '+57', '').trim();
      setPhoneNumber(cleanPhone);
    }
  }, [currentProfile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }
    const cleanDigits = phoneNumber.replace(/[^\d]/g, '');
    if (!cleanDigits || cleanDigits.length < 7) {
      setError('Por favor ingresa un número de teléfono celular válido');
      return;
    }

    const fullPhone = `${countryCode}${cleanDigits}`;
    const deviceId = currentProfile?.deviceId || 'dev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);

    onSave({
      deviceId,
      name: name.trim(),
      phone: fullPhone,
      countryCode
    });
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wedding-coffee/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-wedding-lg border border-wedding-sand overflow-hidden transform transition-all duration-300 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-wedding-terracotta/10 via-wedding-gold/10 to-wedding-cream p-6 text-center relative border-b border-wedding-sand/60">
          {!isFirstTime && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-wedding-coffee/60 hover:text-wedding-coffee hover:bg-wedding-sand/40 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-wedding-terracotta to-wedding-gold text-white flex items-center justify-center shadow-lg shadow-wedding-terracotta/20 animate-float-slow">
            <Heart className="w-7 h-7 fill-white text-white" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-wedding-coffee">
            {isFirstTime ? '¡Bienvenido a la Boda!' : 'Tu Perfil de Invitado'}
          </h2>
          <p className="text-xs text-wedding-coffee/75 mt-1 max-w-xs mx-auto font-medium">
            Ingresa tu nombre y WhatsApp para coordinar transportes y conectarte con otros invitados de Daniel y Analía.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Campo Nombre */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-wedding-terracotta">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sofía Restrepo"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white focus:border-wedding-terracotta focus:ring-2 focus:ring-wedding-terracotta/20 text-sm font-medium text-wedding-coffee outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Campo WhatsApp con Código de País */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              WhatsApp (Número Celular) *
            </label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-2.5 py-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white focus:border-wedding-terracotta text-xs font-semibold text-wedding-coffee outline-none transition-all"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-7 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-wedding-terracotta">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white focus:border-wedding-terracotta focus:ring-2 focus:ring-wedding-terracotta/20 text-sm font-medium text-wedding-coffee outline-none transition-all"
                  required
                />
              </div>
            </div>
            <p className="text-[11px] text-wedding-coffee/60 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-wedding-gold inline" /> Se generará un enlace directo de WhatsApp al reservar o publicar.
            </p>
          </div>

          {/* Botón de Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-wedding-terracotta hover:bg-wedding-terracotta-dark text-white font-semibold text-sm shadow-lg shadow-wedding-terracotta/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              <span>{isFirstTime ? 'Comenzar a Usar la App' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
