import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth'; // Import store
import Game from './views/Game.vue';
import Home from './views/Home.vue';
import Leaderboard from './views/Leaderboard.vue';
import Login from './views/Login.vue';
import PrivacyPolicy from './views/PrivacyPolicy.vue';
import Profile from './views/Profile.vue';
import Register from './views/Register.vue';
import TermsOfService from './views/TermsOfService.vue';
import UserBestScores from './views/UserBestScores.vue';
import Users from './views/Users.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/game',
    component: Game,
    // <-- PROTECTION TAG REMOVED FOR GUEST MODE
  },
  {
    path: '/users',
    component: Users,
    meta: { requiresAuth: true } // <-- PROTECTION TAG
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/user/:username',
    component: Profile,
    // Public profile view - no auth required
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
    // <-- ETICHETTA DI PROTEZIONE
  },
  {
    path: '/userbestscores',
    component: UserBestScores,
    meta: { requiresAuth: true } // <-- ETICHETTA DI PROTEZIONE
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy
  },
  {
    path: '/terms-of-service',
    component: TermsOfService
  },
];
const router = createRouter( {
  history: createWebHistory(),
  routes,
} );
// THE BOUNCER 🕵️‍♂️
router.beforeEach( ( to, from, next ) => {
  const authStore = useAuthStore();

  if ( to.meta.requiresAuth && !authStore.isAuthenticated ) {
    next( '/login' );
  } else {
    next();
  }
} );
export default router;