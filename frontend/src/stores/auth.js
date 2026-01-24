import { defineStore } from 'pinia';
import api from '../services/api';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.token;
        this.user = response.data.user;
        
        // Salva token nel browser
        localStorage.setItem('token', this.token);
        return true;
      } catch (error) {
        console.error('Login failed', error);
        throw error.response?.data?.error || 'Login failed';
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    // Opzionale: recupera profilo all'avvio
    async fetchUser(id) {
       // ... implementeremo se serve
    }
  },
});