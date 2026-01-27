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

    <!-- Desktop Navigation -->
    <div class="desktop-links">
      <template v-if="authStore.isAuthenticated">
        <router-link to="/leaderboard" class="desktop-link">
          <Trophy :size="16" />
          <span>Classifiche</span>
        </router-link>
        <router-link to="/userbestscores" class="desktop-link">
          <Sparkles :size="16" />
          <span>Record</span>
        </router-link>
        <router-link to="/users" class="desktop-link">
          <Users :size="16" />
          <span>Utenti</span>
        </router-link>
        <router-link to="/profile" class="user-info-desktop desktop-link">
          <img
            :src="getAvatarUrl(authStore.user?.avatar)"
            alt="Avatar"
            class="nav-avatar-sm"
          />
          <span class="nav-username">{{ authStore.user?.username }}</span>
        </router-link>
        <a href="/" @click.prevent="logout" class="logout-link desktop-link">
          <LogOut :size="16" />
          <span>Logout</span>
        </a>
      </template>
      <template v-else>
        <router-link to="/leaderboard" class="desktop-link">
          <Trophy :size="16" />
          <span>Classifiche</span>
        </router-link>
        <router-link to="/login" class="desktop-link">
          <LogIn :size="16" />
          <span>Accedi</span>
        </router-link>
        <router-link to="/register" class="register-btn-desktop">
          <UserPlus :size="16" />
          <span>Registrati</span>
        </router-link>
      </template>
    </div>

    <!-- Premium Mobile Menu (Overlay) -->
    <div
      class="mobile-menu-overlay"
      :class="{ open: menuOpen }"
      @click="menuOpen = false"
    ></div>

    <div class="mobile-menu" :class="{ open: menuOpen }">
      <!-- HEADER -->
      <div class="menu-header">
        <!-- Decorative blobs -->
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>

        <div class="header-content" @click="navigate('/')">
          <img
            src="../assets/hundredpath-logo.png"
            alt="Logo"
            class="menu-logo"
          />
          <div>
            <h2 class="menu-title">HundredPath</h2>
            <p class="menu-subtitle">Il Gioco Logico 10×10</p>
          </div>
        </div>
      </div>

      <!-- SCROLLABLE CONTENT -->
      <div class="menu-body">
        <!-- MAIN MENU ITEMS -->
        <div class="menu-items">
          <!-- Tutorial -->
          <button class="menu-card" @click="navigate('/game?mode=tutorial')">
            <div class="icon-box gradient-1">
              <GraduationCap class="menu-icon" />
            </div>
            <div class="text-box">
              <span class="label">Tutorial</span>
              <span class="desc">Impara le regole</span>
            </div>
          </button>

          <button
            v-if="authStore.isAuthenticated"
            class="menu-card"
            @click="navigate('/game?mode=ranked')"
          >
            <div class="icon-box gradient-ranked">
              <Swords class="menu-icon" />
            </div>
            <div class="text-box">
              <span class="label">Ranked</span>
              <span class="desc">Competitiva</span>
            </div>
          </button>

          <!-- Classifiche -->
          <button class="menu-card" @click="navigate('/leaderboard')">
            <div class="icon-box gradient-2">
              <Trophy class="menu-icon" />
            </div>
            <div class="text-box">
              <span class="label">Classifiche</span>
              <span class="desc">Sfida i migliori</span>
            </div>
          </button>

          <!-- Profile / Record (If Auth) -->
          <button
            v-if="authStore.isAuthenticated"
            class="menu-card"
            @click="navigate('/userbestscores')"
          >
            <div class="icon-box gradient-3">
              <Sparkles class="menu-icon" />
            </div>
            <div class="text-box">
              <span class="label">I Miei Record</span>
              <span class="desc">I tuoi punteggi migliori</span>
            </div>
          </button>
          <!-- Users (If Auth) -->
          <button
            v-if="authStore.isAuthenticated"
            class="menu-card"
            @click="navigate('/users')"
          >
            <div class="icon-box gradient-4">
              <Users class="menu-icon" />
            </div>
            <div class="text-box">
              <span class="label">Community</span>
              <span class="desc">Cerca altri giocatori</span>
            </div>
          </button>
        </div>

        <div class="divider"></div>

        <!-- AUTH SECTION -->
        <div class="auth-section">
          <template v-if="!authStore.isAuthenticated">
            <button class="btn-outline" @click="navigate('/login')">
              <LogIn class="btn-icon" /> Accedi
            </button>
            <button class="btn-gradient" @click="navigate('/register')">
              <UserPlus class="btn-icon" /> Registrati Gratis
            </button>
          </template>

          <template v-else>
            <!-- User Profile Snippet -->
            <div class="user-profile-card" @click="navigate('/profile')">
              <img
                :src="getAvatarUrl(authStore.user?.avatar)"
                class="profile-avatar"
              />
              <div class="profile-info">
                <span class="p-username">{{ authStore.user?.username }}</span>
                <span class="p-email">Gestisci Profilo</span>
              </div>
            </div>

            <button class="btn-outline logout" @click="logout">
              <LogOut class="btn-icon" /> Logout
            </button>
          </template>
        </div>
      </div>

      <!-- Footer Decoration -->
      <div class="menu-footer-deco">
        <div class="blob blob-3"></div>
        <div class="blob blob-4"></div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {
  GraduationCap,
  LogIn,
  LogOut,
  Sparkles,
  Swords,
  Trophy,
  UserPlus,
  Users,
} from "lucide-vue-next";
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

function navigate(path) {
  menuOpen.value = false;
  router.push(path);
}

function logout() {
  menuOpen.value = false;
  authStore.logout();
  router.push("/");
}
</script>

<style scoped>
/* NAVBAR LAYOUT */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5rem;
  background-color: hsla(250, 100%, 98%, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 50;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 800;
  font-size: 1.5rem;
}
.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

.text-gradient {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.text-gradient-2 {
  background: linear-gradient(135deg, #d63384 0%, #20c997 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* DESKTOP LINKS */
.desktop-links {
  display: flex;
  align-items: center;
  gap: 20px;
}
.desktop-links a {
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  transition: color 0.2s;
}
.desktop-links a:hover {
  color: #7950f2;
}

/* Desktop link with icon */
.desktop-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.desktop-link:hover {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(121, 80, 242, 0.3);
}

.register-btn-desktop {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  color: white !important;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600 !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(121, 80, 242, 0.2);
}
.register-btn-desktop:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(121, 80, 242, 0.3);
}
.nav-avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
}

/* HAMBURGER */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
}
.hamburger span {
  width: 25px;
  height: 3px;
  background: #333;
  transition: 0.3s;
  border-radius: 2px;
}
.hamburger.open span:first-child {
  transform: rotate(45deg) translate(5px, 6px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:last-child {
  transform: rotate(-45deg) translate(5px, -6px);
}

/* MOBILE MENU & OVERLAY */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 900;
}
.mobile-menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 85%;
  max-width: 350px;
  height: 100vh;
  background: #ffffff;
  z-index: 1000;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  transition: right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.mobile-menu.open {
  right: 0;
}

/* HEADER */
.menu-header {
  position: relative;
  padding: 30px 20px;
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.1),
    rgba(214, 51, 132, 0.1)
  );
  overflow: hidden;
}
.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 15px;
}
.menu-logo {
  width: 48px;
  height: 48px;
}
.menu-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #7950f2, #d63384, #20c997);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.menu-subtitle {
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
}

/* Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
  opacity: 0.5;
}
.blob-1 {
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(121, 80, 242, 0.3);
}
.blob-2 {
  bottom: -20px;
  left: -20px;
  width: 120px;
  height: 120px;
  background: rgba(32, 201, 151, 0.2);
}

/* BODY */
.menu-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Menu Cards */
.menu-card {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.menu-card:hover {
  border-color: rgba(121, 80, 242, 0.3);
  box-shadow: 0 4px 15px rgba(121, 80, 242, 0.1);
  transform: translateY(-2px);
}

.icon-box {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.menu-icon {
  color: white;
  width: 22px;
  height: 22px;
}

/* Gradients for icons */
.gradient-1 {
  background: linear-gradient(135deg, #4dabf7, #20c997);
} /* Blue-Teal (Matches Home Tutorial) */
.gradient-2 {
  background: linear-gradient(135deg, #d63384, #7950f2);
} /* Pink-Purple */
.gradient-3 {
  background: linear-gradient(135deg, #7950f2, #20c997);
} /* Purple-Teal */
.gradient-4 {
  background: linear-gradient(135deg, #339af0, #5c7cfa);
} /* Blue */
.gradient-ranked {
  background: linear-gradient(135deg, #f06595, #ff6b6b);
} /* Pink-Red (Ranked) */

.text-box {
  display: flex;
  flex-direction: column;
}
.label {
  font-weight: 700;
  color: #343a40;
  font-size: 1rem;
}
.desc {
  font-size: 0.8rem;
  color: #adb5bd;
}
.menu-card:hover .label {
  color: #7950f2;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e9ecef, transparent);
  margin: 10px 0;
}

/* Auth Buttons */
.auth-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-outline,
.btn-gradient {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
  border: none; /* Reset */
}
.btn-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #dee2e6;
  color: #495057;
}
.btn-outline:hover {
  border-color: #7950f2;
  background: rgba(121, 80, 242, 0.05);
  color: #7950f2;
}

.btn-gradient {
  background: linear-gradient(135deg, #7950f2, #d63384, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(121, 80, 242, 0.3);
}
.btn-gradient:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(121, 80, 242, 0.4);
}

.user-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.user-profile-card:hover {
  background: #f1f3f5;
}
.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.profile-info {
  display: flex;
  flex-direction: column;
}
.p-username {
  font-weight: 700;
  color: #333;
}
.p-email {
  font-size: 0.8rem;
  color: #7950f2;
}

/* Footer Deco */
.menu-footer-deco {
  position: relative;
  height: 80px;
  overflow: hidden;
  pointer-events: none;
  margin-top: auto;
}
.blob-3 {
  bottom: -30px;
  left: -30px;
  width: 150px;
  height: 150px;
  background: rgba(121, 80, 242, 0.05);
}
.blob-4 {
  bottom: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(32, 201, 151, 0.05);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1rem;
  }
  .desktop-links {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
@media (min-width: 769px) {
  .mobile-menu,
  .mobile-menu-overlay {
    display: none;
  }
}
</style>
