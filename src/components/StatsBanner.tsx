import React from 'react';
import { Trip } from '../types';
import { Car, Sparkles } from 'lucide-react';

interface StatsBannerProps {
  trips: Trip[];
  onOpenOfferModal: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ trips, onOpenOfferModal }) => {
  const totalCars = trips.length;
  const totalOpenSpots = trips.reduce((acc, t) => acc + t.availableSpots, 0);

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-r from-wedding-terracotta/10 via-wedding-gold/10 to-wedding-sage/10 p-4 sm:p-5 border border-wedding-sand shadow-wedding-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Info y Saludo */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white text-wedding-terracotta flex items-center justify-center shadow-md border border-wedding-sand shrink-0">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-wedding-coffee flex items-center justify-center md:justify-start gap-1.5">
              <span>Coordinación de Transporte</span>
              <Sparkles className="w-4 h-4 text-wedding-gold" />
            </h3>
            <p className="text-xs text-wedding-coffee/80 mt-0.5">
              Debido al cierre del aeropuerto de Pereira, ¡nos ayudamos entre amigos para llegar a la boda!
            </p>
          </div>
        </div>

        {/* Métricas clave */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-wedding-sand shadow-sm text-center">
            <span className="block text-base font-bold text-wedding-terracotta leading-tight">
              {totalCars}
            </span>
            <span className="text-[11px] font-medium text-wedding-coffee/70">
              {totalCars === 1 ? 'Carro' : 'Carros'}
            </span>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-2xl border border-wedding-sand shadow-sm text-center">
            <span className="block text-base font-bold text-wedding-sage leading-tight">
              {totalOpenSpots}
            </span>
            <span className="text-[11px] font-medium text-wedding-coffee/70">
              Cupos Libres
            </span>
          </div>

          <button
            onClick={onOpenOfferModal}
            className="px-3.5 py-2.5 rounded-2xl bg-wedding-coffee hover:bg-wedding-coffee/90 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+ Publicar Carro</span>
          </button>
        </div>

      </div>
    </div>
  );
};
