import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para el proyecto danielyanalia
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAs21SJ2ZjYZRL1XdLRa538xWP1LHY0mKk",
  authDomain: "danielyanalia.firebaseapp.com",
  projectId: "danielyanalia",
  storageBucket: "danielyanalia.appspot.com",
  messagingSenderId: "838129349193",
  appId: "1:838129349193:web:carpoolingboda2026"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Indicador de conexión a Firebase
export const isRealFirebase = true;
