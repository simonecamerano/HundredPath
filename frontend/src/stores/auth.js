import { defineStore } from 'pinia';
import api from '../services/api';
export const useAuthStore = defineStore( 'auth', {
  state: () => ( {
    user: JSON.parse( localStorage.getItem( 'user' ) ) || null,
    token: localStorage.getItem( 'token' ) || null,
  } ),
  getters: {
    isAuthenticated: ( state ) => !!state.token,
  },
  actions: {
    async login( email, password ) {
      try {
        const response = await api.post( '/auth/login', { email, password } );
        this.token = response.data.token;
        this.user = response.data.user;

        // Save token and user in browser
        localStorage.setItem( 'token', this.token );
        localStorage.setItem( 'user', JSON.stringify( this.user ) );
        return true;
      } catch ( error ) {
        console.error( 'Login failed', error );
        throw error.response?.data?.error || 'Login failed';
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem( 'token' );
      localStorage.removeItem( 'user' );
    },
    updateAvatar( newAvatar ) {
      if ( this.user ) {
        // Create new object to trigger reactivity
        this.user = { ...this.user, avatar: newAvatar };
        localStorage.setItem( 'user', JSON.stringify( this.user ) );
      }
    },
    setTutorialCompleted( completed ) {
      if ( this.user ) {
        // Create new object to trigger reactivity
        this.user = { ...this.user, tutorialCompleted: completed };
        localStorage.setItem( 'user', JSON.stringify( this.user ) );
      }
    },
    async refreshUser() {
      try {
        const response = await api.get( '/profile' );
        this.user = response.data;
        localStorage.setItem( 'user', JSON.stringify( this.user ) );
      } catch ( error ) {
        console.error( 'Error refreshing user:', error );
      }
    }
  },
} );