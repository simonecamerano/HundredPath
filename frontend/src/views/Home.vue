<script setup>
import {
    AlertCircle,
    ArrowRight,
    GraduationCap,
    Lock,
    Puzzle,
    Swords,
    Timer,
    Trophy,
    X,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const rankedUnlocked = computed(() => {
  return authStore.isAuthenticated && 
         !authStore.user?.isGuest && 
         (authStore.user?.tutorialCompleted || false);
});

function startGame(mode) {
  router.push(`/game?mode=${mode}`);
}

// Banner Cold Start - Dismissible per session
const showColdStartBanner = ref(true);

function dismissBanner() {
  showColdStartBanner.value = false;
  // Non salviamo in localStorage, quindi riapparirà al prossimo refresh
}
</script>

<template>
  <div class="home-container">
    <!-- Cold Start Warning Banner -->
    <div v-if="showColdStartBanner" class="cold-start-banner">
      <AlertCircle style="width: 1.2rem; height: 1.2rem; flex-shrink: 0;" />
      <p>
        <strong>⚠️ Alpha Demo Notice:</strong> This app runs on a free server that goes to sleep after inactivity. 
        <strong>Your first request may take up to 60 seconds</strong> to wake it up. After that, everything will be instant! ⚡
      </p>
      <button @click="dismissBanner" class="dismiss-btn" aria-label="Dismiss">
        <X style="width: 1rem; height: 1rem;" />
      </button>
    </div>

    <!-- HERO SECTION -->
    <header class="hero">
      <div class="hero-content">
        <h1 class="title">
          <span class="text-gradient">Hundred</span
          ><span class="text-gradient-2">Path</span>
        </h1>
        <p class="subtitle">
          The 10×10 logic challenge. Find the right path and reach 100!
        </p>

        <!-- TUTORIAL CARD (Always visible or for guests) -->
        <!-- Logic: If guest/not logged in -> Big Tutorial Card. -->
        <!-- If logged in -> Show both options but styled nicely. -->

        <div
          v-if="!authStore.isAuthenticated || authStore.user?.isGuest"
          class="tutorial-card-wrapper"
        >
          <div class="tutorial-card">
            <div class="card-icon-wrapper blue-gradient">
              <GraduationCap style="width: 50px; height: 50px" />
            </div>
            <h2>Tutorial</h2>
            <p>Learn the rules with visual aids</p>

            <button @click="startGame('tutorial')" class="cta-button">
              Start now
              <ArrowRight
                style="
                  width: 1rem;
                  height: 1rem;
                  margin-left: 0.5rem;
                  position: relative;
                  top: 3px;
                "
              />
            </button>
          </div>

          <p class="unlock-text">
            <router-link to="/register" class="pink-link"
              >Register</router-link
            >
            to unlock Ranked mode!
          </p>
        </div>

        <!-- LOGGED IN VIEW (Classic 2 buttons but better styled) -->
        <div v-else class="logged-modes">
          <button @click="startGame('tutorial')" class="mode-card">
            <div class="card-icon-wrapper blue-gradient">
              <GraduationCap style="width: 50px; height: 50px" />
            </div>
            <h3>Tutorial</h3>
            <p>Practice with aids</p>
          </button>

          <button
            @click="startGame('ranked')"
            class="mode-card"
            :class="{ locked: !rankedUnlocked }"
            :disabled="!rankedUnlocked"
          >
            <div class="card-icon-wrapper gradient-ranked">
              <Swords
                v-if="rankedUnlocked"
                style="width: 50px; height: 50px; color: white"
              />
              <Lock
                v-else
                style="width: 50px; height: 50px; color: white; opacity: 0.8"
              />
            </div>
            <h3>Ranked</h3>
            <p v-if="rankedUnlocked">Competitive</p>
            <p v-else class="locked-text">Complete 1 tutorial</p>
          </button>
        </div>
      </div>
    </header>

    <!-- FEATURES -->
    <section class="features">
      <div class="feature-card grid">
        <div class="feature-icon-box purple-bg">
          <Puzzle style="width: 35px; height: 35px; color: blue" />
        </div>
        <h3>10×10 Grid</h3>
        <p>Move by jumping 2 squares horizontally or 1 diagonally.</p>
      </div>
      <div class="feature-card speed">
        <div class="feature-icon-box pink-bg">
          <Timer style="width: 35px; height: 35px; color: hsla(320 85% 60%)" />
        </div>
        <h3>Speedrun</h3>
        <p>Complete the path in the shortest time possible.</p>
      </div>
      <div class="feature-card cup">
        <div class="feature-icon-box teal-bg">
          <Trophy style="width: 35px; height: 35px; color: #20c997" />
        </div>
        <h3>Leaderboard</h3>
        <p>Climb to the top and challenge your friends.</p>
      </div>
    </section>
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
  padding-top: 20px;
}

/* COLD START BANNER */
.cold-start-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffe7a0 100%);
  border: 2px solid #ffb020;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 30px;
  max-width: 700px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(255, 176, 32, 0.2);
  animation: slideDown 0.3s ease-out;
  color: #856404;
}

.cold-start-banner p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  flex: 1;
}

.cold-start-banner strong {
  color: #664d03;
}

.dismiss-btn {
  background: transparent;
  border: none;
  color: #856404;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dismiss-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* HERO */
.hero {
  text-align: center;
  padding: 0 20px 40px;
  max-width: 800px;
  width: 100%;
}

.title {
  font-size: 4.5rem;
  margin-bottom: 10px;
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.1;
}

.gradient-ranked {
  background: linear-gradient(135deg, #f06595, #ff6b6b);
} /* Pink-Red (Ranked) */

.subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 50px;
  font-weight: 400;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* TUTORIAL CARD */
.tutorial-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.tutorial-card {
  background: white;
  border: 2px solid #63e6be; /* Light teal border */
  border-radius: 24px;
  padding: 40px 60px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(32, 201, 151, 0.15); /* Teal shadow glow */
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
}

.tutorial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(32, 201, 151, 0.25);
}

.card-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

.blue-gradient {
  background: linear-gradient(90deg, #20c997 0%, #4c6ef5 100%);
  color: white;
  box-shadow: 0 5px 15px rgba(51, 154, 240, 0.3);
}

.tutorial-card h2 {
  font-size: 1.8rem;
  color: #212529;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.tutorial-card p {
  color: #868e96;
  margin: 0 0 30px 0;
}

.cta-button {
  background: linear-gradient(90deg, #20c997 0%, #4c6ef5 100%);
  border: none;
  padding: 15px 40px;
  color: white;
  font-weight: 700;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  box-shadow: 0 5px 15px rgba(76, 110, 245, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 110, 245, 0.4);
}

.unlock-text {
  font-size: 0.9rem;
  color: #adb5bd;
}

.pink-link {
  color: #d63384;
  font-weight: 700;
  text-decoration: none;
}
.pink-link:hover {
  text-decoration: underline;
}

/* LOGGED IN MODES */
.logged-modes {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.mode-card {
  background: white;
  border: 2px solid #e9ecef; /* Default subtle border */
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 350px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Tutorial Mode Styling (Blue/Teal) */
.mode-card:first-child {
  border-color: #63e6be;
  box-shadow: 0 10px 30px rgba(32, 201, 151, 0.1);
}
.mode-card:first-child:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(32, 201, 151, 0.2);
}

/* Ranked Mode Styling (Pink/Red) - Matching Tutorial Card Structure */
.mode-card:nth-child(2) {
  border: 2px solid #f7a8a8; /* Red/Pink Border like Tutorial */
  background: linear-gradient(
    180deg,
    #fff,
    #fff0f6
  ); /* Subtle pink tint at bottom */
  box-shadow: 0 10px 30px rgba(240, 101, 149, 0.15); /* Pink Glow */
}

/* Hover effect for Ranked Card */
.mode-card:nth-child(2):hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(240, 101, 149, 0.25); /* Stronger Pink Glow */
}

.mode-card h3 {
  margin: 15px 0 5px;
  color: #343a40;
  font-weight: 700;
  font-size: 1.4rem;
}
.mode-card p {
  margin: 0;
  color: #868e96;
  font-size: 0.95rem;
}
.pink-gradient {
  background: linear-gradient(135deg, #d63384 0%, #20c997 100%);
  color: white;
  box-shadow: 0 5px 15px rgba(240, 101, 149, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Specific Hover for Ranked Card */
.mode-card:hover .pink-gradient {
  transform: scale(1.1);
  transition: transform 0.3s;
}

.mode-card:nth-child(2):hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(240, 101, 149, 0.2);
}

.locked {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(0.8);
}
.locked-text {
  color: #e03131 !important;
  font-weight: 600;
  font-size: 0.8rem !important;
}

/* FEATURES */
.features {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 10000px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 24px;

  width: 280px;
  text-align: center;
  border: 1px solid #ececec;
  transition: transform 0.3s;
}

.grid:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px hsla(250, 90%, 90%);
}

.speed:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px hsla(320, 50%, 85%);
}

.cup:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 25px hsla(170, 50%, 85%);
}

.feature-icon-box {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.purple-bg {
  background: linear-gradient(
    135deg,
    hsla(250, 90%, 90%) 0%,
    hsla(320, 85%, 90%) 100%
  );
}
.pink-bg {
  background: linear-gradient(
    135deg,
    hsla(320, 90%, 85%) 0%,
    hsla(170, 85%, 85%) 100%
  );
}
.teal-bg {
  background: linear-gradient(
    135deg,
    hsla(170, 85%, 85%) 0%,
    hsla(250, 90%, 90%) 100%
  );
}

.feature-card h3 {
  margin-bottom: 10px;
  font-size: 1.3rem;
  color: #212529;
  font-weight: 700;
}

.feature-card p {
  color: #868e96;
  font-size: 1rem;
  line-height: 1.6;
}

/* MOBILE */
@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }
  .tutorial-card {
    padding: 30px 20px;
    width: 90%;
  }
  .feature-card {
    width: 90%;
  }
  .logged-modes {
    flex-wrap: nowrap;
    gap: 20px;
    padding: 0 15px;
  }
  .mode-card {
    width: 160px;
    min-width: 140px;
    padding: 20px 15px;
  }
  .mode-card h3 {
    font-size: 1rem;
  }
  .mode-card p {
    font-size: 0.8rem;
  }
}
</style>
