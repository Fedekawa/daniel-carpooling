import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UserProfileModal } from './components/UserProfileModal';
import { FilterBar } from './components/FilterBar';
import { StatsBanner } from './components/StatsBanner';
import { TripCard } from './components/TripCard';
import { OfferTripModal } from './components/OfferTripModal';
import { Toast, ToastMessage } from './components/Toast';
import { Trip, UserProfile, TripFilter } from './types';
import { 
  subscribeToTrips, 
  createTrip, 
  reserveSpot, 
  cancelReservation, 
  deleteTrip,
  generateWhatsAppLink 
} from './services/carpoolService';
import { Car, Heart, RefreshCw } from 'lucide-react';

const USER_PROFILE_KEY = 'daniel_analia_user_profile_v1';

export function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFirstTimeProfile, setIsFirstTimeProfile] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(true);

  // Pestañas y Filtros
  const [activeTab, setActiveTab] = useState<'all' | 'my_trips'>('all');
  const [filter, setFilter] = useState<TripFilter>({
    direction: 'all',
    city: 'todas',
    onlyWithSpots: false
  });

  // Cargar Perfil de Usuario desde LocalStorage al iniciar
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        // Si no hay perfil, abrir modal de bienvenida la primera vez
        setIsFirstTimeProfile(true);
        setIsProfileModalOpen(true);
      }
    } catch (e) {
      console.error('Error cargando perfil:', e);
    }
  }, []);

  // Suscribirse a viajes en tiempo real
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTrips((updatedTrips) => {
      setTrips(updatedTrips);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Guardar perfil de usuario
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    setIsProfileModalOpen(false);
    setIsFirstTimeProfile(false);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: '¡Perfil Guardado!',
      message: `Hola ${profile.name.split(' ')[0]}, ya puedes reservar o publicar carros.`
    });
  };

  // Reservar un cupo en un carro
  const handleReserveSpot = async (trip: Trip) => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
      return;
    }

    const passenger = {
      id: userProfile.deviceId,
      name: userProfile.name,
      phone: userProfile.phone,
      reservedAt: new Date().toISOString()
    };

    const success = await reserveSpot(trip.id, passenger);

    if (success) {
      // Generar enlace WhatsApp y abrir inmediatamente
      const waUrl = generateWhatsAppLink(
        trip.driverPhone, 
        trip.driverName, 
        userProfile.name, 
        trip
      );
      
      window.open(waUrl, '_blank');

      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: '¡Cupo Reservado con Éxito! 🎉',
        message: `Te hemos redirigido a WhatsApp para confirmar con ${trip.driverName}.`
      });
    } else {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'No se pudo reservar',
        message: 'Parece que los cupos se agotaron o ya tenías una reserva.'
      });
    }
  };

  // Cancelar reserva de cupo
  const handleCancelReservation = async (tripId: string, passengerId: string) => {
    const success = await cancelReservation(tripId, passengerId);
    if (success) {
      setToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'Reserva Cancelada',
        message: 'Tu cupo ha sido liberado para otros invitados.'
      });
    }
  };

  // Publicar un nuevo carro
  const handleCreateTrip = async (tripData: Omit<Trip, 'id' | 'createdAt' | 'passengers'>) => {
    await createTrip(tripData);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: '¡Carro Publicado! 🚗',
      message: 'Tu vehículo ya está visible para todos los invitados.'
    });
  };

  // Eliminar un carro publicado por el usuario
  const handleDeleteTrip = async (tripId: string) => {
    if (!userProfile) return;
    if (confirm('¿Estás seguro de que deseas eliminar este carro de la lista?')) {
      await deleteTrip(tripId, userProfile.deviceId);
      setToast({
        id: Date.now().toString(),
        type: 'info',
        title: 'Carro Eliminado',
        message: 'La publicación ha sido removida.'
      });
    }
  };

  // Auxiliar para verificar si un viaje le pertenece al usuario (como conductor o pasajero)
  const isMyTrip = (trip: Trip) => {
    if (!userProfile) return false;
    const cleanUser = userProfile.phone.replace(/[^\d]/g, '');
    if (!cleanUser) return trip.driverDeviceId === userProfile.deviceId;

    const driverPhoneClean = trip.driverPhone.replace(/[^\d]/g, '');
    const isDriver = 
      trip.driverDeviceId === userProfile.deviceId ||
      (driverPhoneClean && (driverPhoneClean === cleanUser || (cleanUser.length >= 8 && driverPhoneClean.endsWith(cleanUser.slice(-8)))));

    const isPassenger = trip.passengers.some(p => {
      const passengerPhoneClean = p.phone.replace(/[^\d]/g, '');
      return p.id === userProfile.deviceId || 
        (passengerPhoneClean && (passengerPhoneClean === cleanUser || (cleanUser.length >= 8 && passengerPhoneClean.endsWith(cleanUser.slice(-8)))));
    });

    return isDriver || isPassenger;
  };

  // Filtrado de Viajes
  const filteredTrips = trips.filter((trip) => {
    // Si estamos en la pestaña "Mis Viajes"
    if (activeTab === 'my_trips') {
      return isMyTrip(trip);
    }

    // Si estamos en la pestaña "Todos"
    if (filter.direction !== 'all' && trip.direction !== filter.direction) {
      return false;
    }

    if (filter.onlyWithSpots && trip.availableSpots <= 0) {
      return false;
    }

    if (filter.city !== 'todas') {
      const targetCity = trip.direction === 'to_pereira' ? trip.originCity : trip.destinationCity;
      if (targetCity.toLowerCase() !== filter.city.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // Contador de "Mis Viajes"
  const myTripsCount = userProfile ? trips.filter(isMyTrip).length : 0;

  return (
    <div className="min-h-screen bg-wedding-cream flex flex-col font-sans">
      
      {/* Encabezado Nupcial */}
      <Header
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenOfferModal={() => {
          if (!userProfile) setIsProfileModalOpen(true);
          else setIsOfferModalOpen(true);
        }}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Banner de Métricas y Bienvenida */}
        <StatsBanner
          trips={trips}
          onOpenOfferModal={() => {
            if (!userProfile) setIsProfileModalOpen(true);
            else setIsOfferModalOpen(true);
          }}
        />

        {/* Barra de Filtros y Pestañas */}
        <FilterBar
          filter={filter}
          onChangeFilter={setFilter}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          myTripsCount={myTripsCount}
        />

        {/* Lista de Carros */}
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 mx-auto text-wedding-terracotta animate-spin mb-3" />
            <p className="text-sm font-semibold text-wedding-coffee/70">Cargando carros disponibles...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="py-12 px-4 text-center bg-white rounded-3xl border border-wedding-sand shadow-wedding-sm max-w-lg mx-auto">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-wedding-terracotta-light text-wedding-terracotta flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-wedding-coffee mb-1">
              {activeTab === 'my_trips' ? 'No tienes viajes guardados' : 'No hay carros con este filtro'}
            </h3>
            <p className="text-xs text-wedding-coffee/70 mb-5 max-w-xs mx-auto">
              {activeTab === 'my_trips'
                ? 'Reserva un cupo en un carro disponible o publica el tuyo para que aparezca aquí.'
                : 'Sé el primero en ofrecer tu carro para este trayecto y ayuda a otros invitados.'}
            </p>
            <button
              onClick={() => {
                if (!userProfile) setIsProfileModalOpen(true);
                else setIsOfferModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-wedding-terracotta hover:bg-wedding-terracotta-dark text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Publicar mi Carro Ahora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                currentUser={userProfile}
                onReserve={handleReserveSpot}
                onCancelReservation={handleCancelReservation}
                onDeleteTrip={handleDeleteTrip}
              />
            ))}
          </div>
        )}

      </main>

      {/* Pie de Página Nupcial */}
      <footer className="mt-12 py-8 bg-white border-t border-wedding-sand text-center text-xs text-wedding-coffee/70">
        <div className="max-w-md mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-1.5 font-serif font-bold text-sm text-wedding-coffee">
            <span>Daniel & Analía</span>
            <Heart className="w-3.5 h-3.5 text-wedding-terracotta fill-wedding-terracotta" />
            <span>2026 Pereira, Colombia</span>
          </div>
          <p className="text-[11px] text-wedding-coffee/60">
            Creado para conectar a nuestros familiares y amigos en el viaje a Pereira.
          </p>
          
          <a 
            href="https://kyto.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="pt-3 border-t border-wedding-sand/40 inline-flex items-center justify-center gap-1.5 text-[11px] font-medium text-wedding-coffee/50 hover:text-wedding-coffee transition-colors"
          >
            <span>Created by</span>
            <img 
              src="/kyto-lockup-ink.svg" 
              alt="Kyto" 
              className="h-3.5 w-auto opacity-70 hover:opacity-100 transition-opacity inline-block" 
            />
          </a>
        </div>
      </footer>

      {/* Modales y Notificaciones */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        currentProfile={userProfile}
        isFirstTime={isFirstTimeProfile}
      />

      <OfferTripModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSubmit={handleCreateTrip}
        currentUser={userProfile}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}

export default App;
