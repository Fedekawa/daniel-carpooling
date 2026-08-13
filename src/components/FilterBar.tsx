import React from 'react';
import { TripFilter, CITIES } from '../types';
import { Compass, MapPin, UserCheck } from 'lucide-react';

interface FilterBarProps {
  filter: TripFilter;
  onChangeFilter: (newFilter: TripFilter) => void;
  activeTab: 'all' | 'my_trips';
  onChangeTab: (tab: 'all' | 'my_trips') => void;
  myTripsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChangeFilter,
  activeTab,
  onChangeTab,
  myTripsCount
}) => {
  return (
    <div className="space-y-4 mb-6">
      
      {/* Pestañas Principales: Todos los Viajes vs. Mis Viajes */}
      <div className="flex items-center justify-between bg-wedding-sand/50 p-1.5 rounded-2xl border border-wedding-sand">
        <button
          onClick={() => onChangeTab('all')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'all'
              ? 'bg-white text-wedding-coffee shadow-wedding-sm border border-wedding-sand/50'
              : 'text-wedding-coffee/70 hover:text-wedding-coffee hover:bg-white/40'
          }`}
        >
          <Compass className="w-4 h-4 text-wedding-terracotta" />
          <span>Todos los Carros Disponibles</span>
        </button>

        <button
          onClick={() => onChangeTab('my_trips')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 relative ${
            activeTab === 'my_trips'
              ? 'bg-white text-wedding-coffee shadow-wedding-sm border border-wedding-sand/50'
              : 'text-wedding-coffee/70 hover:text-wedding-coffee hover:bg-white/40'
          }`}
        >
          <UserCheck className="w-4 h-4 text-wedding-sage" />
          <span>Mis Viajes & Reservas</span>
          {myTripsCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-wedding-terracotta text-white shadow-sm">
              {myTripsCount}
            </span>
          )}
        </button>
      </div>

      {/* Sub-filtros por Trayecto y Ciudad si estamos en la pestaña principal */}
      {activeTab === 'all' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-wedding-sand/80 shadow-wedding-sm">
          
          {/* Toggle de Trayecto */}
          <div className="flex items-center gap-1 bg-wedding-cream p-1 rounded-xl border border-wedding-sand/50">
            <button
              onClick={() => onChangeFilter({ ...filter, direction: 'all' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter.direction === 'all'
                  ? 'bg-wedding-coffee text-white shadow-sm'
                  : 'text-wedding-coffee/70 hover:text-wedding-coffee'
              }`}
            >
              Todos los Trayectos
            </button>
            <button
              onClick={() => onChangeFilter({ ...filter, direction: 'to_pereira' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filter.direction === 'to_pereira'
                  ? 'bg-wedding-terracotta text-white shadow-sm'
                  : 'text-wedding-coffee/70 hover:text-wedding-coffee'
              }`}
            >
              <span>Ir a Pereira</span> ➔
            </button>
            <button
              onClick={() => onChangeFilter({ ...filter, direction: 'from_pereira' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                filter.direction === 'from_pereira'
                  ? 'bg-wedding-sage text-white shadow-sm'
                  : 'text-wedding-coffee/70 hover:text-wedding-coffee'
              }`}
            >
              <span>Regreso</span> 🏠
            </button>
          </div>

          {/* Filtro por Ciudad de Origen */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-wedding-terracotta shrink-0" />
            <span className="text-xs font-semibold text-wedding-coffee/70 whitespace-nowrap">Origen:</span>
            <select
              value={filter.city}
              onChange={(e) => onChangeFilter({ ...filter, city: e.target.value })}
              className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-wedding-sand bg-wedding-cream/60 focus:bg-white text-xs font-semibold text-wedding-coffee outline-none"
            >
              <option value="todas">Cualquier Ciudad</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

    </div>
  );
};
