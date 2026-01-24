import { createRouter, createWebHistory } from 'vue-router';
// Importa le viste che hai appena creato
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Game from './views/Game.vue';
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/game', component: Game },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;