import React from 'react';
import { UserProfile } from '../types';
import { Car, User, Heart, MapPin, Sparkles } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile | null;
  onOpenProfile: () => void;
  onOpenOfferModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  onOpenProfile,
  onOpenOfferModal
}) => {
  return (
    <header className="sticky top-0 z-30 glass-header border-b border-wedding-sand/80 shadow-wedding-sm transition-all duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        
        {/* Logo / Título de la Boda */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-wedding-terracotta to-wedding-gold text-white flex items-center justify-center shadow-md shadow-wedding-terracotta/20 animate-float-slow">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-wedding-coffee">
                Daniel & Analía
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-wedding-gold/15 text-wedding-gold border border-wedding-gold/30">
                <Sparkles className="w-3 h-3" /> Boda Pereira
              </span>
            </div>
            <p className="text-xs text-wedding-coffee/70 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-wedding-terracotta inline" /> Carpooling Nupcial
            </p>
          </div>
        </div>

        {/* Acciones del encabezado */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Botón de Publicar Carro */}
          <button
            onClick={onOpenOfferModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-wedding-terracotta hover:bg-wedding-terracotta-dark text-white text-xs sm:text-sm font-semibold shadow-md shadow-wedding-terracotta/25 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Car className="w-4 h-4" />
            <span className="hidden xs:inline">Ofrecer Carro</span>
            <span className="xs:hidden">Publicar</span>
          </button>

          {/* Perfil del Invitado */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-wedding-cream border border-wedding-sand text-wedding-coffee text-xs sm:text-sm font-medium shadow-wedding-sm transition-all hover:border-wedding-terracotta/40"
            title="Editar Perfil"
          >
            <div className="w-6 h-6 rounded-full bg-wedding-terracotta-light text-wedding-terracotta flex items-center justify-center font-bold text-xs">
              {userProfile ? userProfile.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
            </div>
            <span className="max-w-[80px] sm:max-w-[120px] truncate font-medium">
              {userProfile ? userProfile.name.split(' ')[0] : 'Mi Nombre'}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
};
