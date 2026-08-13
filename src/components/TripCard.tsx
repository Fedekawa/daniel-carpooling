import React from 'react';
import { Trip, UserProfile } from '../types';
import { generateWhatsAppLink } from '../services/carpoolService';
import { 
  Car, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Info,
  ArrowRight
} from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  currentUser: UserProfile | null;
  onReserve: (trip: Trip) => void;
  onCancelReservation: (tripId: string, passengerId: string) => void;
  onDeleteTrip: (tripId: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  currentUser,
  onReserve,
  onCancelReservation,
  onDeleteTrip
}) => {
  // Normalizar teléfono del usuario actual para comparaciones exactas
  const cleanUser = currentUser ? currentUser.phone.replace(/[^\d]/g, '') : '';
  const driverPhoneClean = trip.driverPhone.replace(/[^\d]/g, '');

  // Comprobar si el usuario actual es el conductor (por deviceId o por coincidencia de número telefónico)
  const isDriver = Boolean(
    currentUser && (
      currentUser.deviceId === trip.driverDeviceId ||
      (cleanUser && driverPhoneClean && (driverPhoneClean === cleanUser || (cleanUser.length >= 8 && driverPhoneClean.endsWith(cleanUser.slice(-8)))))
    )
  );

  // Comprobar si el usuario actual ya reservó un cupo en este carro
  const userPassenger = currentUser 
    ? trip.passengers.find(p => {
        const passengerPhoneClean = p.phone.replace(/[^\d]/g, '');
        return p.id === currentUser.deviceId || 
          (cleanUser && passengerPhoneClean && (passengerPhoneClean === cleanUser || (cleanUser.length >= 8 && passengerPhoneClean.endsWith(cleanUser.slice(-8)))));
      })
    : null;
  const isReservedByMe = Boolean(userPassenger);

  // Formato de fecha amigable en español
  const dateObj = new Date(trip.departureDate + 'T' + (trip.departureTime || '00:00'));
  const formattedDate = dateObj.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  // Generar enlace WhatsApp si el usuario ya reservó o para contactar al conductor
  const whatsappUrl = currentUser 
    ? generateWhatsAppLink(trip.driverPhone, trip.driverName, currentUser.name, trip)
    : '#';

  const handleReserveClick = () => {
    onReserve(trip);
  };

  return (
    <div className={`rounded-3xl bg-white border transition-all duration-300 overflow-hidden shadow-wedding ${
      isReservedByMe 
        ? 'border-wedding-terracotta ring-2 ring-wedding-terracotta/20 bg-wedding-cream/30' 
        : 'border-wedding-sand/90 hover:border-wedding-terracotta/40 hover:shadow-wedding-lg'
    }`}>
      
      {/* Encabezado del Card: Trayecto y Estado */}
      <div className="p-5 sm:p-6 border-b border-wedding-sand/60">
        
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Badge de Dirección */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              trip.direction === 'to_pereira'
                ? 'bg-wedding-terracotta-light text-wedding-terracotta border border-wedding-terracotta/20'
                : 'bg-wedding-sage-light text-wedding-sage border border-wedding-sage/20'
            }`}>
              <Car className="w-3.5 h-3.5" />
              {trip.direction === 'to_pereira' ? 'Ir a Pereira' : 'De Regreso'}
            </span>

            {isDriver && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-wedding-coffee text-white">
                Tú Conduces
              </span>
            )}

            {isReservedByMe && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                Tu Cupo Reservado
              </span>
            )}
          </div>

          {/* Contador de Cupos Libres */}
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
              trip.availableSpots > 0
                ? 'bg-wedding-gold-light text-wedding-coffee border border-wedding-gold/30'
                : 'bg-gray-150 text-gray-500 border border-gray-200'
            }`}>
              {trip.availableSpots > 0 
                ? `${trip.availableSpots} ${trip.availableSpots === 1 ? 'cupo libre' : 'cupos libres'}`
                : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Ruta Origen -> Destino */}
        <div className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold text-wedding-coffee mb-2">
          <span>{trip.originCity}</span>
          <ArrowRight className="w-4 h-4 text-wedding-terracotta shrink-0" />
          <span>{trip.destinationCity}</span>
        </div>

        {/* Fecha, Hora y Punto de Recogida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-wedding-coffee/80 mt-3">
          <div className="flex items-center gap-2 bg-wedding-cream/60 px-3 py-2 rounded-xl border border-wedding-sand/40">
            <Calendar className="w-4 h-4 text-wedding-terracotta shrink-0" />
            <span className="capitalize">{formattedDate}</span>
            <span className="text-wedding-sand">|</span>
            <Clock className="w-4 h-4 text-wedding-terracotta shrink-0" />
            <span>{trip.departureTime} hs</span>
          </div>

          <div className="flex items-center gap-2 bg-wedding-cream/60 px-3 py-2 rounded-xl border border-wedding-sand/40 truncate">
            <MapPin className="w-4 h-4 text-wedding-terracotta shrink-0" />
            <span className="truncate" title={trip.pickupLocation}>
              {trip.pickupLocation}
            </span>
          </div>
        </div>

      </div>

      {/* Cuerpo del Card: Conductor, Pasajeros y Notas */}
      <div className="p-5 sm:p-6 bg-white space-y-4">
        
        {/* Info del Conductor */}
        <div className="flex items-center justify-between bg-wedding-cream/40 p-3 rounded-2xl border border-wedding-sand/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-wedding-terracotta to-wedding-gold text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {trip.driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-wedding-coffee/60 font-medium">Conductor / Anfitrión</p>
              <p className="text-sm font-bold text-wedding-coffee">{trip.driverName}</p>
            </div>
          </div>

          {/* Enlace directo a WhatsApp del conductor */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                onReserve(trip);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-bold transition-all"
            title="Escribir al conductor por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-green-600 fill-green-600/20" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>

        {/* Pasajeros Actuales */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-wedding-coffee/70 mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-wedding-terracotta" />
              <span>
                Pasajeros ({trip.passengers.reduce((sum, p) => sum + (p.spotsCount || 1), 0)} de {trip.totalSpots} cupos)
              </span>
            </span>
          </div>

          {trip.passengers.length === 0 ? (
            <p className="text-xs text-wedding-coffee/50 italic bg-wedding-cream/30 p-2.5 rounded-xl border border-dashed border-wedding-sand">
              Aún no hay pasajeros en este carro. ¡Sé el primero en reservar!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trip.passengers.map((p) => {
                const isMe = currentUser && (p.id === currentUser.deviceId || (cleanUser && p.phone.replace(/[^\d]/g, '').endsWith(cleanUser.slice(-8))));
                const spots = p.spotsCount || 1;
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                      isMe
                        ? 'bg-wedding-terracotta-light text-wedding-terracotta border-wedding-terracotta/30 font-bold'
                        : 'bg-wedding-cream text-wedding-coffee border-wedding-sand'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-wedding-terracotta inline-block"></span>
                    <span>{p.name}</span>
                    {spots > 1 && (
                      <span className="text-[10px] bg-wedding-terracotta/15 px-1.5 py-0.5 rounded-md font-bold">
                        {spots} cupos {p.companionNames ? `(${p.companionNames})` : ''}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Notas adicionales del conductor (si existen) */}
        {trip.notes && (
          <div className="text-xs text-wedding-coffee/80 bg-wedding-gold-light/60 p-3 rounded-2xl border border-wedding-gold/20 flex items-start gap-2">
            <Info className="w-4 h-4 text-wedding-gold shrink-0 mt-0.5" />
            <p className="leading-relaxed">{trip.notes}</p>
          </div>
        )}

        {/* Botones de Acción */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          
          {/* Si ya reservó: Botón para cancelar reserva y botón para abrir WhatsApp */}
          {isReservedByMe ? (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <a
                href={generateWhatsAppLink(
                  trip.driverPhone,
                  trip.driverName,
                  currentUser?.name || 'Invitado',
                  trip,
                  userPassenger?.spotsCount || 1,
                  userPassenger?.companionNames
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-green-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Abrir Chat con {trip.driverName.split(' ')[0]}</span>
              </a>

              <button
                onClick={() => onCancelReservation(trip.id, userPassenger?.id || currentUser!.deviceId)}
                className="py-3 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>
                  Cancelar mi Reserva ({(userPassenger?.spotsCount || 1)} {(userPassenger?.spotsCount || 1) === 1 ? 'cupo' : 'cupos'})
                </span>
              </button>
            </div>
          ) : isDriver ? (
            // Si es el conductor: Botón para eliminar o editar
            <div className="w-full flex items-center justify-between bg-wedding-cream/60 p-2.5 rounded-2xl border border-wedding-sand">
              <span className="text-xs font-semibold text-wedding-coffee/70 pl-2">
                Publicaste este carro
              </span>
              <button
                onClick={() => onDeleteTrip(trip.id)}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Carro</span>
              </button>
            </div>
          ) : (
            // Si hay cupos disponibles: Botón para Reservar
            <button
              onClick={handleReserveClick}
              disabled={trip.availableSpots <= 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                trip.availableSpots > 0
                  ? 'bg-wedding-terracotta hover:bg-wedding-terracotta-dark text-white shadow-wedding-terracotta/25 hover:shadow-lg transform active:scale-[0.99]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>
                {trip.availableSpots > 0 ? 'Reservar mi Cupo (Gratis)' : 'Cupos Agotados'}
              </span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
