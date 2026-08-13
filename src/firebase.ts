import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para el proyecto danielyanalia
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForLocalDevAndPreview12345",
  authDomain: "danielyanalia.firebaseapp.com",
  projectId: "danielyanalia",
  storageBucket: "danielyanalia.appspot.com",
  messagingSenderId: "838129349193",
  appId: "1:838129349193:web:carpoolingboda2026"
};

// Inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Indicador si la API key es válida o si usamos almacenamiento local de respaldo
export const isRealFirebase = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSyDummyKeyForLocalDevAndPreview12345"
);
