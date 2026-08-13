import React, { useState, useEffect } from 'react';
import { Trip, UserProfile } from '../types';
import { Users, X, Check, UserPlus } from 'lucide-react';

interface ReserveSpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
  currentUser: UserProfile | null;
  onConfirm: (spotsCount: number, companionNames: string) => void;
  isSubmitting: boolean;
}

export const ReserveSpotModal: React.FC<ReserveSpotModalProps> = ({
  isOpen,
  onClose,
  trip,
  currentUser,
  onConfirm,
  isSubmitting
}) => {
  const [spotsCount, setSpotsCount] = useState<number>(1);
  const [companionNames, setCompanionNames] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSpotsCount(1);
      setCompanionNames('');
    }
  }, [isOpen, trip]);

  if (!isOpen || !trip || !currentUser) return null;

  const maxSpots = Math.max(1, trip.availableSpots);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(spotsCount, companionNames.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wedding-coffee/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-wedding-lg border border-wedding-sand relative overflow-hidden">
        
        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-2 text-wedding-coffee/60 hover:text-wedding-coffee rounded-full hover:bg-wedding-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-wedding-terracotta/10 text-wedding-terracotta rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-wedding-coffee">
              Reservar Cupos
            </h3>
            <p className="text-xs text-wedding-coffee/70">
              Carro de {trip.driverName} ({trip.originCity} ➔ {trip.destinationCity})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Selector de Cantidad de Cupos */}
          <div>
            <label className="block text-xs font-semibold text-wedding-coffee mb-2">
              ¿Cuántos cupos deseas reservar?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: maxSpots }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSpotsCount(num)}
                  className={`py-3 rounded-2xl text-sm font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                    spotsCount === num
                      ? 'bg-wedding-terracotta text-white border-wedding-terracotta shadow-md scale-105'
                      : 'bg-wedding-cream/60 border-wedding-sand text-wedding-coffee hover:bg-wedding-sand/40'
                  }`}
                >
                  <span>{num} {num === 1 ? 'cupo' : 'cupos'}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-wedding-coffee/60 mt-1.5">
              Cupos disponibles en este vehículo: <span className="font-bold text-wedding-terracotta">{trip.availableSpots}</span>
            </p>
          </div>

          {/* Campo opcional si es más de 1 cupo */}
          {spotsCount > 1 && (
            <div className="animate-fade-in bg-wedding-cream/50 p-3.5 rounded-2xl border border-wedding-sand/80 space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-wedding-coffee">
                <UserPlus className="w-4 h-4 text-wedding-terracotta" />
                <span>¿Quiénes te acompañan? (Opcional)</span>
              </label>
              <input
                type="text"
                value={companionNames}
                onChange={(e) => setCompanionNames(e.target.value)}
                placeholder="ej. Esposa e hijo, Ana y Carlos"
                className="w-full px-3.5 py-2.5 rounded-xl border border-wedding-sand bg-white text-xs font-medium text-wedding-coffee placeholder-wedding-coffee/40 outline-none focus:ring-2 focus:ring-wedding-terracotta/40"
              />
              <p className="text-[11px] text-wedding-coffee/60">
                Esta información le ayuda a {trip.driverName} a conocer a sus pasajeros.
              </p>
            </div>
          )}

          {/* Resumen de la Reserva */}
          <div className="p-3 bg-wedding-sand/30 rounded-2xl border border-wedding-sand flex items-center justify-between text-xs">
            <span className="font-semibold text-wedding-coffee">Reserva a nombre de:</span>
            <span className="font-bold text-wedding-coffee">{currentUser.name}</span>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl border border-wedding-sand text-xs font-semibold text-wedding-coffee/70 hover:bg-wedding-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-wedding-terracotta hover:bg-wedding-terracotta/90 text-white text-xs font-bold transition-all shadow-wedding-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Reservando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirmar ({spotsCount} {spotsCount === 1 ? 'cupo' : 'cupos'})</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
