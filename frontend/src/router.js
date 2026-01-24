import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth'; // Import store
import Game from './views/Game.vue';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Leaderboard from './views/Leaderboard.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/game',
    component: Game,
    meta: { requiresAuth: true } // <-- ETICHETTA DI PROTEZIONE
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
    meta: { requiresAuth: true } // <-- ETICHETTA DI PROTEZIONE
  },  
];
const router = createRouter( {
  history: createWebHistory(),
  routes,
} );
// IL BUTTAFUORI 🕵️‍♂️
router.beforeEach( ( to, from, next ) => {
  const authStore = useAuthStore();

  console.log( "Navigating to:", to.path );
  console.log( "Requires Auth:", to.meta.requiresAuth );
  console.log( "Is Authenticated:", authStore.isAuthenticated );

  if ( to.meta.requiresAuth && !authStore.isAuthenticated ) {
    console.log( "BLOCKED! Redirecting to login..." );
    next( '/login' );
  } else {
    next();
  }
} );
export default router;