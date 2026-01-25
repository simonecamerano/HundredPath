<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">HundredPath 💯</router-link>
    </div>
    <div class="links">
      <template v-if="authStore.isAuthenticated">
        <div class="user-info">
          <img
            :src="getAvatarUrl(authStore.user?.avatar)"
            alt="Avatar"
            class="nav-avatar"
          />
          <span class="nav-username">{{ authStore.user?.username }}</span>
        </div>
        <router-link to="/game">Gioca</router-link>
        <router-link to="/leaderboard">Classifica 🏆</router-link>
        <router-link to="/userbestscores">Record 🏆</router-link>
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

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  // Se inizia con "shape_", usa stile astratto. Altrimenti Adventurer.
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

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

.links {
  display: flex;
  align-items: center;
  gap: 15px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid #eee;
}
.nav-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f0f0;
}
.nav-username {
  font-weight: bold;
  color: #333;
}
</style>
