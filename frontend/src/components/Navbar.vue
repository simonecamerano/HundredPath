<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">HundredPath 💯</router-link>
    </div>

    <!-- Hamburger menu button (mobile only) -->
    <button
      class="hamburger"
      @click="menuOpen = !menuOpen"
      :class="{ open: menuOpen }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Navigation links -->
    <div class="links" :class="{ open: menuOpen }">
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile" class="user-info" @click="menuOpen = false">
          <img
            :src="getAvatarUrl(authStore.user?.avatar)"
            alt="Avatar"
            class="nav-avatar"
          />
          <span class="nav-username">{{ authStore.user?.username }}</span>
        </router-link>
        <router-link to="/leaderboard" @click="menuOpen = false"
          >Classifiche 🏆</router-link
        >
        <router-link to="/userbestscores" @click="menuOpen = false"
          >Record 🏆</router-link
        >
        <router-link to="/users" @click="menuOpen = false">Utenti</router-link>
        <a href="/" @click.prevent="logout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/leaderboard" @click="menuOpen = false"
          >Classifiche 🏆</router-link
        >
        <router-link to="/login" @click="menuOpen = false">Accedi</router-link>
        <router-link to="/register" @click="menuOpen = false"
          >Registrati</router-link
        >
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const menuOpen = ref(false);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function logout() {
  menuOpen.value = false;
  authStore.logout();
  router.push("/");
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 20rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0rem;
  position: relative;
}

.logo a {
  font-weight: bold;
  font-size: 1.5rem;
  text-decoration: none;
  color: #333;
}

.links {
  display: flex;
  align-items: center;
  gap: 15px;
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
}

.user-info:hover {
  opacity: 0.8;
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

/* Hamburger button (hidden on desktop) */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #333;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 4px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -4px);
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .logo a {
    font-size: 1.2rem;
  }

  /* Show hamburger button */
  .hamburger {
    display: flex;
  }

  /* Mobile menu */
  .links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 75%;
    max-width: 320px;
    height: 100vh;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 1.5rem 2rem;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    gap: 0;
    z-index: 1000;
  }

  .links.open {
    right: 0;
  }

  .links a {
    margin-left: 0;
    width: 100%;
    padding: 16px 12px;
    font-size: 1rem;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
    color: white;
  }

  .links a:hover {
    background: #f8f9fa;
  }

  .user-info {
    padding: 16px 12px;
    border-bottom: 2px solid #e9ecef;
    width: 100%;
    margin-bottom: 10px;
  }

  .nav-avatar {
    width: 45px;
    height: 45px;
  }

  .nav-username {
    font-size: 1rem;
    font-weight: 600;
    color: white
  }
}

/* Close menu when clicking outside */
@media (max-width: 768px) {
  .links::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  .links.open::before {
    opacity: 1;
    visibility: visible;
  }
}
</style>
