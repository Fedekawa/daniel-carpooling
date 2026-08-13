# Especificación de Diseño: App de Carpooling para la Boda de Daniel y Analía

**Fecha:** 2026-08-13  
**Estado:** Borrador / Listo para Aprobación  
**Evento:** Boda de Daniel & Analía (Pereira, Colombia)  
**Plataforma de Despliegue:** Vercel  
**Proyecto GCP / Firebase:** `danielyanalia` (ID: 838129349193)  

---

## 1. Contexto y Problema
Cierre del aeropuerto de Pereira: Los invitados deben viajar por carretera desde Bogotá, Armenia, Cali u otras ciudades. Muchos invitados no se conocen entre sí.

Esta aplicación web en español permite a los invitados:
1. Registrar su nombre y número de WhatsApp (con código de país, por defecto `+57`).
2. Ver carros disponibles con cupos abiertos hacia o desde Pereira.
3. Publicar su vehículo especificando ruta, fecha, hora, punto de encuentro y cupos.
4. Reservar un cupo en un carro con 1 clic y abrir un chat preescrito en WhatsApp (`wa.me`) directamente con el conductor.
5. Gestionar/cancelar sus reservas o sus publicaciones.

---

## 2. Flujos de Usuario e Interfaz (En Español)

### A. Registro Inicial (Sin Fricción)
- Al ingresar por primera vez, un modal amigable solicita:
  - **Nombre Completo**
  - **Teléfono de WhatsApp** (con selector de código de país `+57`, `+1`, etc.)
- Guardado en `localStorage` del navegador para no requerir contraseñas ni correos.

### B. Buscar Viaje (Pasajeros)
1. Lista en tiempo real de carros disponibles ordenados por fecha y hora de salida.
2. Filtros por:
   - **Dirección:** Todos, "Hacia Pereira", "De Regreso"
   - **Ciudad de Origen:** Bogotá, Armenia, Cali, Otra
3. Tarjeta de Carro:
   - Nombre del Conductor y teléfono
   - Ruta (Ej: Bogotá ➔ Pereira)
   - Fecha y Hora de Salida
   - Punto de Encuentro / Recogida (Ej: "Portal Norte", "Hotel Movich")
   - Contador de Cupos (Ej: `2 de 4 cupos disponibles`)
   - Lista de pasajeros que ya reservaron
   - Notas / Detalles del vehículo (espacio de maletas, etc.)
4. **Acción "Reservar Cupo":**
   - Disminuye los cupos en tiempo real en Firestore.
   - Añade al invitado a la lista de pasajeros.
   - Abre WhatsApp (`https://wa.me/573001234567?text=...`) con un mensaje automático:  
     *"¡Hola [Conductor]! Te escribo desde la app de la boda de Daniel y Analía. Acabo de reservar un cupo en tu carro desde [Ciudad] para el [Fecha] a las [Hora]."*
5. **Acción "Cancelar Reserva":**
   - Permite liberar el cupo en cualquier momento.

### C. Publicar Viaje (Conductores)
1. Botón destacado **"Publicar Carro"**.
2. Formulario en modal:
   - **Trayecto:** Yendo a Pereira O Regresando de Pereira
   - **Ciudad de Origen / Destino:** Bogotá, Armenia, Cali u Otra
   - **Fecha y Hora de Salida**
   - **Lugar de Encuentro / Recogida**
   - **Cupos Disponibles** (1 a 6)
   - **Notas Adicionales**
3. Al guardar, se publica instantáneamente en tiempo real.

---

## 3. Arquitectura Técnica y Despliegue en Vercel

- **Stack:** React 18 + Vite + Tailwind CSS + Firebase Firestore (SDK JS).
- **Despliegue Vercel:**
  - Archivo de configuración `vercel.json` con reescritura de rutas SPA (`/ -> /index.html`).
  - Comando de build: `npm run build` (Salida: `dist`).
- **Modo Demostración / Respaldos:**
  - Incluye modo de almacenamiento simulado local (Mock Storage) si las llaves de Firestore están en proceso, garantizando visualización y prueba 100% funcional.
