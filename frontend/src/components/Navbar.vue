<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">HundredPath 💯</router-link>
    </div>
    <div class="links">
      <template v-if="authStore.isAuthenticated">
        <router-link to="/game">Gioca</router-link>
        <router-link to="/leaderboard">Classifica 🏆</router-link>
        <a href="#" @click.prevent="logout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/login">Accedi</router-link>
        <router-link to="/register">Registrati</router-link>
      </template>
    </div>
  </nav>
</template>
<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
const router = useRouter();
function logout() {
  authStore.logout();
  router.push("/login");
}
</script>
<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}
.logo a {
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  color: #333;
}
.links a {
  margin-left: 20px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
}
.links a:hover {
  color: #007bff;
}
</style>
