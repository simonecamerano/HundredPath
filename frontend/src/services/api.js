import axios from 'axios';

const api = axios.create( {
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
} );

// Interceptor per aggiungere il token e timestamp
api.interceptors.request.use(
  ( config ) => {
    const token = localStorage.getItem( 'token' );
    if ( token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Aggiungi timestamp per calcolare durata richiesta
    config.metadata = { startTime: Date.now() };
    return config;
  },
  ( error ) => Promise.reject( error )
);

// Interceptor per rilevare cold start
api.interceptors.response.use(
  ( response ) => {
    const duration = Date.now() - response.config.metadata.startTime;
    checkColdStart(duration);
    return response;
  },
  ( error ) => {
    // Calcola durata anche per gli errori
    if (error.config && error.config.metadata) {
      const duration = Date.now() - error.config.metadata.startTime;
      checkColdStart(duration);
    }
    return Promise.reject( error );
  }
);

// Funzione helper per rilevare cold start
function checkColdStart(duration) {
  // Se la richiesta impiega più di 5 secondi, probabile cold start
  if (duration > 5000) {
    const coldStartShown = sessionStorage.getItem('coldStartNotificationShown');
    
    if (!coldStartShown) {
      // Mostra notifica una sola volta per sessione
      window.dispatchEvent(new CustomEvent('cold-start-detected', {
        detail: { duration: Math.round(duration / 1000) }
      }));
      
      sessionStorage.setItem('coldStartNotificationShown', 'true');
    }
  }
}

export default api;