import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isRealFirebase } from '../firebase';
import { Trip, Passenger } from '../types';

const COLLECTION_NAME = 'trips';
const LOCAL_STORAGE_KEY = 'daniel_analia_carpools_prod_v2';

// Auxiliar para obtener trips desde localStorage (eliminando cualquier demo previo)
function getLocalTrips(): Trip[] {
  try {
    // Limpiar clave antigua si existía con demos
    localStorage.removeItem('daniel_analia_carpools_v1');

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const trips: Trip[] = JSON.parse(raw);
    // Eliminar explícitamente cualquier elemento con id demo
    const cleanTrips = trips.filter(t => !t.id.startsWith('demo-'));
    if (cleanTrips.length !== trips.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanTrips));
    }
    return cleanTrips;
  } catch (err) {
    console.error('Error leyendo trips de localStorage', err);
    return [];
  }
}

// Auxiliar para guardar trips en localStorage y emitir evento custom
function saveLocalTrips(trips: Trip[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
  window.dispatchEvent(new Event('local_trips_updated'));
}

/**
 * Suscribirse a viajes en tiempo real
 */
export function subscribeToTrips(onUpdate: (trips: Trip[]) => void): () => void {
  if (isRealFirebase) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('departureDate', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const trips: Trip[] = [];
        snapshot.forEach((docSnap) => {
          if (!docSnap.id.startsWith('demo-')) {
            trips.push({ id: docSnap.id, ...docSnap.data() } as Trip);
          }
        });
        onUpdate(trips);
      }, (error) => {
        console.warn("Firestore listener no disponible, usando respaldo local:", error);
        onUpdate(getLocalTrips());
      });
    } catch (e) {
      console.warn("Error con Firestore, usando respaldo local:", e);
    }
  }

  // Fallback LocalStorage con evento en tiempo real
  onUpdate(getLocalTrips());
  const handleLocalChange = () => {
    onUpdate(getLocalTrips());
  };
  window.addEventListener('local_trips_updated', handleLocalChange);
  window.addEventListener('storage', handleLocalChange);

  return () => {
    window.removeEventListener('local_trips_updated', handleLocalChange);
    window.removeEventListener('storage', handleLocalChange);
  };
}

/**
 * Crear un nuevo viaje
 */
export async function createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'passengers'>): Promise<string> {
  const newTripPayload = {
    ...tripData,
    passengers: [],
    createdAt: new Date().toISOString()
  };

  if (isRealFirebase) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newTripPayload);
      return docRef.id;
    } catch (err) {
      console.warn('Error al guardar en Firestore, guardando localmente:', err);
    }
  }

  const current = getLocalTrips();
  const id = 'trip-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const fullTrip: Trip = { id, ...newTripPayload };
  saveLocalTrips([fullTrip, ...current]);
  return id;
}

/**
 * Reservar un cupo en un viaje
 */
export async function reserveSpot(tripId: string, passenger: Passenger): Promise<boolean> {
  let success = false;

  if (isRealFirebase) {
    try {
      const tripsLocal = getLocalTrips();
      const targetTrip = tripsLocal.find(t => t.id === tripId);
      if (targetTrip) {
        if (targetTrip.availableSpots <= 0) return false;
        const updatedPassengers = [...targetTrip.passengers, passenger];
        const updatedSpots = targetTrip.totalSpots - updatedPassengers.length;
        
        await updateDoc(doc(db, COLLECTION_NAME, tripId), {
          passengers: updatedPassengers,
          availableSpots: updatedSpots
        });
        return true;
      }
    } catch (err) {
      console.warn('Error actualizando Firestore, aplicando en local:', err);
    }
  }

  const current = getLocalTrips();
  const updated = current.map(trip => {
    if (trip.id === tripId) {
      if (trip.availableSpots <= 0) return trip;
      // Verificar si ya está reservado
      if (trip.passengers.some(p => p.id === passenger.id)) return trip;
      
      const newPassengers = [...trip.passengers, passenger];
      const newAvailable = Math.max(0, trip.totalSpots - newPassengers.length);
      success = true;
      return {
        ...trip,
        passengers: newPassengers,
        availableSpots: newAvailable
      };
    }
    return trip;
  });

  if (success) {
    saveLocalTrips(updated);
  }
  return success;
}

/**
 * Cancelar la reserva de un pasajero
 */
export async function cancelReservation(tripId: string, passengerId: string): Promise<boolean> {
  let success = false;

  if (isRealFirebase) {
    try {
      const tripsLocal = getLocalTrips();
      const targetTrip = tripsLocal.find(t => t.id === tripId);
      if (targetTrip) {
        const newPassengers = targetTrip.passengers.filter(p => p.id !== passengerId);
        const newAvailable = targetTrip.totalSpots - newPassengers.length;
        await updateDoc(doc(db, COLLECTION_NAME, tripId), {
          passengers: newPassengers,
          availableSpots: newAvailable
        });
        return true;
      }
    } catch (err) {
      console.warn('Error actualizando Firestore, aplicando en local:', err);
    }
  }

  const current = getLocalTrips();
  const updated = current.map(trip => {
    if (trip.id === tripId) {
      const newPassengers = trip.passengers.filter(p => p.id !== passengerId);
      const newAvailable = trip.totalSpots - newPassengers.length;
      success = true;
      return {
        ...trip,
        passengers: newPassengers,
        availableSpots: newAvailable
      };
    }
    return trip;
  });

  if (success) {
    saveLocalTrips(updated);
  }
  return success;
}

/**
 * Eliminar un viaje publicado por el conductor
 */
export async function deleteTrip(tripId: string, driverDeviceId: string): Promise<boolean> {
  if (isRealFirebase) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, tripId));
      return true;
    } catch (err) {
      console.warn('Error eliminando de Firestore, eliminando localmente:', err);
    }
  }

  const current = getLocalTrips();
  const filtered = current.filter(t => t.id !== tripId || (driverDeviceId && t.driverDeviceId === driverDeviceId));
  saveLocalTrips(filtered);
  return true;
}

/**
 * Generar enlace wa.me para conectar con el conductor
 */
export function generateWhatsAppLink(
  driverPhone: string, 
  driverName: string, 
  passengerName: string,
  trip: Trip
): string {
  // Limpiar caracteres del número telefónico
  const cleanPhone = driverPhone.replace(/[^\d+]/g, '').replace('+', '');
  
  const directionText = trip.direction === 'to_pereira' 
    ? `desde ${trip.originCity} hacia Pereira` 
    : `de regreso desde Pereira hacia ${trip.destinationCity}`;
    
  const dateFormatted = new Date(trip.departureDate + 'T' + trip.departureTime)
    .toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });

  const message = `¡Hola ${driverName}! 🚗 Te escribo desde la app de carpooling de la Boda de Daniel y Analía. Soy ${passengerName} y acabo de reservar un cupo en tu carro (${directionText}) para el ${dateFormatted} a las ${trip.departureTime}. ¡Muchas gracias por la cola/aventón! 🎉`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
