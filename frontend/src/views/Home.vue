<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const rankedUnlocked = ref(false);
const loadingUser = ref(true);

async function checkRankedUnlock() {
  if (authStore.isAuthenticated && !authStore.user?.isGuest) {
    try {
      const res = await api.get("/profile");
      rankedUnlocked.value = res.data.tutorialCompleted || false;
      console.log("🔓 Ranked unlock status:", rankedUnlocked.value);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  }
  loadingUser.value = false;
}

onMounted(async () => {
  await checkRankedUnlock();
});

// Ricarica quando torniamo alla home
watch(
  () => route.path,
  async (newPath) => {
    if (newPath === "/") {
      await checkRankedUnlock();
    }
  },
);

function startGame(mode) {
  router.push(`/game?mode=${mode}`);
}
</script>

<template>
  <div class="home-container">
    <!-- HERO SECTION -->
    <header class="hero">
      <div class="hero-content">
        <h1 class="title">HundredPath</h1>
        <p class="subtitle">La sfida logica 10x10. Raggiungi il 100.</p>

        <!-- GUEST MODE -->
        <div
          v-if="!authStore.isAuthenticated || authStore.user?.isGuest"
          class="guest-section"
        >
          <div class="game-modes">
            <button
              @click="startGame('tutorial')"
              class="mode-btn tutorial-btn"
            >
              <div class="mode-icon">🎓</div>
              <div class="mode-info">
                <h3>Tutorial</h3>
                <p>Impara le regole con gli aiuti visivi</p>
              </div>
            </button>
          </div>
          <p v-if="!authStore.isAuthenticated" class="register-cta">
            <router-link to="/register">Registrati</router-link> per sbloccare
            la modalità Ranked!
          </p>
          <p v-else class="register-cta">
            <router-link to="/register">Crea un account</router-link> per
            salvare i tuoi progressi!
          </p>
        </div>

        <!-- LOGGED IN USERS -->
        <div v-else class="game-modes">
          <button @click="startGame('tutorial')" class="mode-btn tutorial-btn">
            <div class="mode-icon">🎓</div>
            <div class="mode-info">
              <h3>Tutorial</h3>
              <p>Pratica con gli aiuti visivi</p>
            </div>
          </button>

          <button
            @click="startGame('ranked')"
            class="mode-btn ranked-btn"
            :class="{ locked: !rankedUnlocked }"
            :disabled="!rankedUnlocked"
          >
            <div class="mode-icon">{{ rankedUnlocked ? "🏆" : "🔒" }}</div>
            <div class="mode-info">
              <h3>Ranked</h3>
              <p v-if="rankedUnlocked">Modalità competitiva</p>
              <p v-else class="unlock-hint">
                Completa 1 tutorial per sbloccare
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- FEATURES -->
    <section class="features">
      <div class="feature-card">
        <div class="icon">🧩</div>
        <h3>Griglia 10x10</h3>
        <p>Muoviti saltando 2 caselle in orizzontale o 1 in diagonale.</p>
      </div>
      <div class="feature-card">
        <div class="icon">⏱️</div>
        <h3>Speedrun</h3>
        <p>Completa il percorso nel minor tempo possibile.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🏆</div>
        <h3>Classifica</h3>
        <p>Scala la vetta globale e sfida i tuoi amici.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <p>&copy; 2025 HundredPath - Developed with ❤️ by Simone Camerano</p>
    </footer>
  </div>
</template>

<style scoped>
/* CONTAINER */
.home-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 0px; /* Ridotto drasticamente */
}

/* HERO SECTION */
.hero {
  text-align: center;
  padding: 0 20px 40px; /* Tolto padding top: 0, laterale 20, sotto 40 */
  max-width: 800px;
}

.title {
  font-size: 4rem;
  margin-bottom: 10px;
  font-weight: 800;
  background: -webkit-linear-gradient(45deg, #007bff, #6610f2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

.subtitle {
  font-size: 1.5rem;
  color: #6c757d;
  margin-bottom: 40px;
  font-weight: 300;
}

/* GAME MODE BUTTONS */
.game-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.mode-btn {
  background: white;
  border: 3px solid transparent;
  border-radius: 16px;
  padding: 30px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.mode-btn:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tutorial-btn {
  border-color: #28a745;
}

.tutorial-btn:hover {
  border-color: #28a745;
  background: #f0fff4;
}

.ranked-btn {
  border-color: #ffc107;
}

.ranked-btn:hover:not(.locked) {
  border-color: #ffc107;
  background: #fffbf0;
}

.ranked-btn.locked {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #dee2e6;
}

.mode-icon {
  font-size: 3rem;
}

.mode-info h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.mode-info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.unlock-hint {
  color: #dc3545 !important;
  font-weight: 500;
}

.register-cta {
  font-size: 0.95rem;
  color: #6c757d;
  margin-top: 20px;
}

.register-cta a {
  color: #007bff;
  font-weight: bold;
  text-decoration: none;
}

.registerlink a:hover {
  text-decoration: underline;
}

/* FEATURES SECTION */
.features {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 250px;
  text-align: center;
  border: 1px solid #f1f3f5;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #343a40;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
}

footer {
  margin-top: 80px;
  color: #ced4da;
  font-size: 0.8rem;
  padding-bottom: 20px;
}

/* MOBILE */
@media (max-width: 600px) {
  .title {
    font-size: 2.5rem;
  }
  .cta-group {
    flex-direction: column;
  }
  .features {
    gap: 15px;
  }
  .feature-card {
    width: 100%;
  }
}
</style>
