import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  doc
} from 'firebase/firestore';
import { db, isRealFirebase } from '../firebase';
import { Trip, Passenger } from '../types';

const COLLECTION_NAME = 'trips';

/**
 * Suscribirse a viajes en tiempo real
 */
/**
 * Suscribirse a viajes en tiempo real desde Firebase Firestore
 */
export function subscribeToTrips(onUpdate: (trips: Trip[]) => void): () => void {
  if (isRealFirebase) {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      return onSnapshot(colRef, (snapshot) => {
        const trips: Trip[] = [];
        snapshot.forEach((docSnap) => {
          if (!docSnap.id.startsWith('demo-')) {
            trips.push({ id: docSnap.id, ...docSnap.data() } as Trip);
          }
        });
        // Ordenar por fecha de salida
        trips.sort((a, b) => (a.departureDate + a.departureTime).localeCompare(b.departureDate + b.departureTime));
        onUpdate(trips);
      }, (error) => {
        console.error("🔥 Error escuchando Firestore (Revisa las Reglas de Seguridad en Firebase Console):", error);
        onUpdate([]);
      });
    } catch (e) {
      console.error("🔥 Error inicializando Firestore:", e);
    }
  }

  // Si no hay conexión a Firebase, responder vacío
  onUpdate([]);
  return () => {};
}

/**
 * Crear un nuevo viaje directamente en Firebase Firestore
 */
export async function createTrip(tripData: Omit<Trip, 'id' | 'createdAt' | 'passengers'>): Promise<string> {
  const newTripPayload = {
    ...tripData,
    notes: tripData.notes || '',
    pickupLocation: tripData.pickupLocation || '',
    passengers: [],
    createdAt: new Date().toISOString()
  };

  // Limpiar cualquier propiedad que sea undefined para evitar errores de Firestore
  Object.keys(newTripPayload).forEach((key) => {
    if ((newTripPayload as Record<string, any>)[key] === undefined) {
      delete (newTripPayload as Record<string, any>)[key];
    }
  });

  if (isRealFirebase) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), newTripPayload);
      console.log('✅ Viaje creado exitosamente en Firestore:', docRef.id);
      return docRef.id;
    } catch (err) {
      console.error('🔥 Error al crear viaje en Firestore:', err);
      throw err;
    }
  }

  throw new Error('Firebase no está configurado');
}

/**
 * Reservar cupos en un viaje en Firebase Firestore
 */
export async function reserveSpot(tripId: string, passenger: Passenger): Promise<boolean> {
  if (isRealFirebase) {
    try {
      const docRef = doc(db, COLLECTION_NAME, tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Trip;
        const currentPassengers = data.passengers || [];
        const requestedSpots = passenger.spotsCount || 1;

        if (data.availableSpots < requestedSpots) return false;
        if (currentPassengers.some(p => p.id === passenger.id)) return false;

        // Limpiar undefined antes de guardar en Firestore
        const cleanPassenger: Passenger = {
          id: passenger.id,
          name: passenger.name,
          phone: passenger.phone,
          reservedAt: passenger.reservedAt,
          spotsCount: requestedSpots,
          companionNames: passenger.companionNames ? passenger.companionNames.trim() : ''
        };

        const updatedPassengers = [...currentPassengers, cleanPassenger];
        const totalReservedSpots = updatedPassengers.reduce((sum, p) => sum + (p.spotsCount || 1), 0);
        const updatedSpots = Math.max(0, data.totalSpots - totalReservedSpots);
        
        await updateDoc(docRef, {
          passengers: updatedPassengers,
          availableSpots: updatedSpots
        });
        console.log('✅ Cupo(s) reservado(s) en Firestore');
        return true;
      }
    } catch (err) {
      console.error('🔥 Error reservando cupo en Firestore:', err);
      throw err;
    }
  }

  return false;
}

/**
 * Cancelar la reserva de un pasajero en Firebase Firestore
 */
export async function cancelReservation(tripId: string, passengerId: string): Promise<boolean> {
  if (isRealFirebase) {
    try {
      const docRef = doc(db, COLLECTION_NAME, tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Trip;
        const newPassengers = (data.passengers || []).filter(p => p.id !== passengerId);
        const totalReservedSpots = newPassengers.reduce((sum, p) => sum + (p.spotsCount || 1), 0);
        const newAvailable = Math.max(0, data.totalSpots - totalReservedSpots);

        await updateDoc(docRef, {
          passengers: newPassengers,
          availableSpots: newAvailable
        });
        console.log('✅ Reserva cancelada en Firestore');
        return true;
      }
    } catch (err) {
      console.error('🔥 Error cancelando reserva en Firestore:', err);
      throw err;
    }
  }

  return false;
}

/**
 * Eliminar un viaje en Firebase Firestore
 */
export async function deleteTrip(tripId: string, _driverDeviceId: string): Promise<boolean> {
  if (isRealFirebase) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, tripId));
      console.log('✅ Viaje eliminado de Firestore');
      return true;
    } catch (err) {
      console.error('🔥 Error eliminando viaje de Firestore:', err);
      throw err;
    }
  }

  return false;
}

/**
 * Generar enlace wa.me para conectar con el conductor
 */
export function generateWhatsAppLink(
  driverPhone: string, 
  driverName: string, 
  passengerName: string,
  trip: Trip,
  spotsCount: number = 1,
  companionNames?: string
): string {
  // Limpiar caracteres del número telefónico
  const cleanPhone = driverPhone.replace(/[^\d+]/g, '').replace('+', '');
  
  const directionText = trip.direction === 'to_pereira' 
    ? `desde ${trip.originCity} hacia Pereira` 
    : `de regreso desde Pereira hacia ${trip.destinationCity}`;
    
  const dateFormatted = new Date(trip.departureDate + 'T' + trip.departureTime)
    .toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });

  const spotsText = spotsCount > 1 
    ? `${spotsCount} cupos${companionNames ? ` (${companionNames})` : ''}` 
    : '1 cupo';

  const message = `Hola ${driverName}, te escribo desde la app de carpooling de la Boda de Daniel y Analía. Soy ${passengerName} y reservé ${spotsText} en tu carro (${directionText}) para el ${dateFormatted} a las ${trip.departureTime}. Me pongo en contacto contigo para verificar la hora, logística y punto de encuentro. Muchas gracias.`;
  
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
