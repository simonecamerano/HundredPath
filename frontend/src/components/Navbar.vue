<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/"
        ><img
          src="../assets/hundredpath-logo.png"
          alt="HundredPath"
          class="logo-img"
        /><span class="text-gradient">Hundred</span
        ><span class="text-gradient-2">Path</span></router-link
      >
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
        <router-link to="/leaderboard" @click="menuOpen = false" class="register-btn"
          ><Trophy style="width: 1rem; height: 1rem; margin-right: 0.5rem; position: relative; top: 2px"/>Classifiche</router-link
        >
        <router-link to="/login" @click="menuOpen = false" class="register-btn">Accedi</router-link>
        <router-link
          to="/register"
          class="register-btn"
          @click="menuOpen = false"
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
import {
  Trophy,
} from "lucide-vue-next"; 

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
  padding: 1rem 5rem;
  background-color: hsla(250, 100%, 98%, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0rem;
  position: relative;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.logo a {
  font-weight: 800;
  font-size: 1.5rem;
  text-decoration: none;
  color: #333;
  display: flex;
  align-items: center;
  /* gap: 8px; REMOVED per user request */
}
.logo a:hover {
  color: #7950f2;
}

.links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.links a {
  margin-left: 20px;
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.links a:hover {
  color: #7950f2;
}

.register-btn {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  color: white !important;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600 !important;
  box-shadow: 0 4px 10px rgba(121, 80, 242, 0.3);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(121, 80, 242, 0.4);
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
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.text-gradient {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-gradient-2 {
  background: linear-gradient(135deg, #d63384 0%, #20c997 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
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
    width: 80%; /* Slightly wider for better card feel */
    max-width: 320px;
    height: 100vh;
    /* Stronger Gradient to be visible */
    background: linear-gradient(160deg, #ffffff 0%, #f3f0ff 60%, #e0cfff 100%);
    border-left: 1px solid white;
    border-radius: 24px 0 0 24px; /* Rounded corners on left */
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 2rem 2rem; /* More padding */
    box-shadow: -10px 0 40px rgba(121, 80, 242, 0.15); /* Purple tinted shadow */
    transition: right 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); /* Smooth spring-like */
    gap: 5px; /* Spacing between links */
    z-index: 1000;
  }

  .links.open {
    right: 0;
  }

  .links a {
    margin-left: 0;
    width: 100%;
    padding: 14px 16px;
    font-size: 1.05rem;
    font-weight: 600;
    border-bottom: none; /* Removed line separator */
    border-radius: 12px; /* Rounded item */
    transition: all 0.2s;
    color: white /* Darker gray */
  }

  .links a:hover {
    background: rgba(121, 80, 242, 0.05);
    color: #7950f2;
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
    color: #333;
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
