import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Il backend
  headers: {
    'Content-Type': 'application/json',
  },
});
// Interceptor per aggiungere il token automaticamente a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;