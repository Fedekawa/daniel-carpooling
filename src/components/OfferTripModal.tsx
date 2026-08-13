import React, { useState } from 'react';
import { UserProfile, Direction, CITIES, Trip } from '../types';
import { Car, Calendar, Clock, MapPin, X, Check } from 'lucide-react';

interface OfferTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Omit<Trip, 'id' | 'createdAt' | 'passengers'>) => void;
  currentUser: UserProfile | null;
}

export const OfferTripModal: React.FC<OfferTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [direction, setDirection] = useState<Direction>('to_pereira');
  const [originCity, setOriginCity] = useState('Bogotá');
  const [destinationCity, setDestinationCity] = useState('Pereira');
  const [customOrigin, setCustomOrigin] = useState('');
  const [departureDate, setDepartureDate] = useState('2026-08-15');
  const [departureTime, setDepartureTime] = useState('07:00');
  const [pickupLocation, setPickupLocation] = useState('');
  const [totalSpots, setTotalSpots] = useState(3);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDirectionChange = (newDir: Direction) => {
    setDirection(newDir);
    if (newDir === 'to_pereira') {
      setDestinationCity('Pereira');
      setDepartureDate('2026-08-15');
      if (originCity === 'Pereira') setOriginCity('Bogotá');
    } else {
      setOriginCity('Pereira');
      setDepartureDate('2026-08-17');
      if (destinationCity === 'Pereira') setDestinationCity('Bogotá');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Debes registrar tu nombre y WhatsApp antes de publicar.');
      return;
    }
    if (!pickupLocation.trim()) {
      setError('Por favor especifica el punto de encuentro o recogida.');
      return;
    }

    const finalOrigin = direction === 'to_pereira' 
      ? (originCity === 'Otra' ? customOrigin.trim() || 'Otra Ciudad' : originCity)
      : 'Pereira';

    const finalDestination = direction === 'from_pereira'
      ? (destinationCity === 'Otra' ? customOrigin.trim() || 'Otra Ciudad' : destinationCity)
      : 'Pereira';

    onSubmit({
      driverName: currentUser.name,
      driverPhone: currentUser.phone,
      direction,
      originCity: finalOrigin,
      destinationCity: finalDestination,
      departureDate,
      departureTime,
      pickupLocation: pickupLocation.trim(),
      totalSpots: Number(totalSpots),
      availableSpots: Number(totalSpots),
      notes: notes.trim() || '',
      driverDeviceId: currentUser.deviceId
    });

    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wedding-coffee/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-wedding-lg border border-wedding-sand overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-wedding-terracotta/10 via-wedding-gold/10 to-wedding-cream p-5 text-center relative border-b border-wedding-sand/60 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-wedding-coffee/60 hover:text-wedding-coffee hover:bg-wedding-sand/40 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-wedding-terracotta text-white flex items-center justify-center shadow-md shadow-wedding-terracotta/20">
            <Car className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-bold text-wedding-coffee">
            Publicar tu Carro para la Boda
          </h2>
          <p className="text-xs text-wedding-coffee/75 mt-1">
            Ofrece cupos libres a otros invitados viajando por carretera a Pereira.
          </p>
        </div>

        {/* Formulario Scrolleable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Selector de Trayecto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              Trayecto del Viaje *
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-wedding-cream rounded-2xl border border-wedding-sand">
              <button
                type="button"
                onClick={() => handleDirectionChange('to_pereira')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  direction === 'to_pereira'
                    ? 'bg-wedding-terracotta text-white shadow-sm'
                    : 'text-wedding-coffee/70 hover:text-wedding-coffee'
                }`}
              >
                <span>Hacia Pereira</span> ➔
              </button>

              <button
                type="button"
                onClick={() => handleDirectionChange('from_pereira')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  direction === 'from_pereira'
                    ? 'bg-wedding-sage text-white shadow-sm'
                    : 'text-wedding-coffee/70 hover:text-wedding-coffee'
                }`}
              >
                <span>De Regreso</span> 🏠
              </button>
            </div>
          </div>

          {/* Selección de Ciudad */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              {direction === 'to_pereira' ? 'Ciudad de Origen *' : 'Ciudad de Destino *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-wedding-terracotta">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={direction === 'to_pereira' ? originCity : destinationCity}
                onChange={(e) => {
                  if (direction === 'to_pereira') setOriginCity(e.target.value);
                  else setDestinationCity(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white text-xs font-semibold text-wedding-coffee outline-none"
              >
                {CITIES.filter(c => c !== 'Pereira').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {((direction === 'to_pereira' && originCity === 'Otra') || (direction === 'from_pereira' && destinationCity === 'Otra')) && (
              <input
                type="text"
                value={customOrigin}
                onChange={(e) => setCustomOrigin(e.target.value)}
                placeholder="Escribe el nombre de la ciudad..."
                className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-wedding-sand text-xs font-medium text-wedding-coffee outline-none focus:border-wedding-terracotta"
                required
              />
            )}
          </div>

          {/* Fecha y Hora de Salida */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
                Fecha *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-wedding-terracotta">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white text-xs font-semibold text-wedding-coffee outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
                Hora de Salida *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-wedding-terracotta">
                  <Clock className="w-4 h-4" />
                </div>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white text-xs font-semibold text-wedding-coffee outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Punto de Encuentro / Recogida */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              Punto de Encuentro / Recogida *
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Ej. Portal del Norte / Estación de Servicio / Hotel Movich"
              className="w-full px-3.5 py-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white text-xs font-semibold text-wedding-coffee outline-none focus:border-wedding-terracotta"
              required
            />
          </div>

          {/* Cupos Disponibles */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              Cupos Libres para Pasajeros *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="6"
                value={totalSpots}
                onChange={(e) => setTotalSpots(Number(e.target.value))}
                className="w-full accent-wedding-terracotta cursor-pointer"
              />
              <span className="w-10 h-10 rounded-xl bg-wedding-terracotta text-white font-bold text-sm flex items-center justify-center shrink-0">
                {totalSpots}
              </span>
            </div>
          </div>

          {/* Notas Adicionales */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-wedding-coffee/80 mb-1.5">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Tipo de vehículo, espacio para maletas, si aceptas mascotas o vas con música..."
              rows={2}
              className="w-full p-3 rounded-xl border border-wedding-sand bg-wedding-cream/40 focus:bg-white text-xs font-medium text-wedding-coffee outline-none focus:border-wedding-terracotta"
            />
          </div>

          {/* Botón Guardar */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-wedding-terracotta hover:bg-wedding-terracotta-dark text-white font-bold text-sm shadow-lg shadow-wedding-terracotta/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              <span>Publicar Carro en la App</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
