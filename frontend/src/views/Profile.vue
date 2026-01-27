<template>
  <div class="page-wrapper">
    <div class="container-sm">
      <div v-if="loading" class="flex-center" style="min-height: 400px">
        <div class="badge badge-purple">Loading...</div>
      </div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else class="profile-content">
        <!-- PROFILE HEADER -->
        <div v-if="profile && profile.username" class="profile-card">
          <div class="profile-header">
            <div class="avatar-wrapper">
              <img
                :src="getAvatarUrl(profile.avatar)"
                alt="Avatar"
                class="profile-avatar"
              />
              <button
                @click="showAvatarPicker = !showAvatarPicker"
                class="avatar-edit-btn"
              >
                <Edit2 :size="16" />
              </button>
            </div>
            <div class="profile-info">
              <h1 class="text-gradient">{{ profile.username }}</h1>
              <p class="join-date">
                <Calendar :size="16" />
                Member since {{ formatDate(profile.createdAt) }}
              </p>
            </div>
          </div>

          <!-- AVATAR PICKER -->
          <div v-if="showAvatarPicker" class="avatar-picker">
            <div class="picker-header">
              <h4>Choose a new avatar</h4>
              <button
                @click="generateRandomAvatar"
                class="btn btn-secondary btn-sm"
              >
                <Shuffle :size="16" />
                New Avatars
              </button>
            </div>
            <div class="avatar-grid">
              <div
                v-for="seed in avatarOptions"
                :key="seed"
                class="avatar-option"
                :class="{ selected: selectedAvatar === seed }"
                @click="selectedAvatar = seed"
              >
                <img
                  :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`"
                  alt="Avatar"
                />
              </div>
            </div>
            <button
              @click="saveAvatar"
              class="btn btn-gradient"
              :disabled="!selectedAvatar"
            >
              <Save :size="18" />
              Save Avatar
            </button>
          </div>
        </div>

        <!-- STATS GRID -->
        <div v-if="profile && profile.stats" class="stats-section">
          <h2 class="section-title">
            <BarChart3 :size="24" />
            Your Statistics
          </h2>
          <div class="stats-grid">
            <div class="stat-card card-hover">
              <Gamepad2 :size="32" class="stat-icon" />
              <div class="stat-label">Games Played</div>
              <div class="stat-value">{{ profile.stats.totalGames || 0 }}</div>
            </div>
            <div class="stat-card card-hover">
              <Trophy :size="32" class="stat-icon trophy-gold" />
              <div class="stat-label">Wins</div>
              <div class="stat-value">{{ profile.stats.wins || 0 }}</div>
            </div>
            <div class="stat-card card-hover" v-if="profile.stats.bestRank">
              <Medal :size="32" class="stat-icon" />
              <div class="stat-label">Best Rank</div>
              <div class="stat-value">#{{ profile.stats.bestRank }}</div>
            </div>
            <div class="stat-card card-hover" v-if="profile.stats.avgDuration">
              <Timer :size="32" class="stat-icon" />
              <div class="stat-label">Average Time</div>
              <div class="stat-value">
                {{ formatDuration(profile.stats.avgDuration) }}
              </div>
            </div>
          </div>
        </div>

        <!-- RECENT GAMES -->
        <div
          class="recent-games-section"
          v-if="recentGames && recentGames.length > 0"
        >
          <h2 class="section-title">
            <Clock :size="24" />
            Recent Games
          </h2>
          <div class="games-list">
            <div v-for="game in recentGames" :key="game._id" class="game-card">
              <div class="game-mode">
                <component
                  :is="game.gameMode === 'ranked' ? Swords : GraduationCap"
                  :size="20"
                />
                <span>{{
                  game.gameMode === "ranked" ? "Ranked" : "Tutorial"
                }}</span>
              </div>
              <div class="game-stats-row">
                <span>
                  <Target :size="14" />
                  {{ game.currentNumber }}
                </span>
                <span>
                  <Timer :size="14" />
                  {{ formatDuration(game.duration) }}
                </span>
                <span class="game-date">{{ formatDate(game.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    BarChart3,
    Calendar,
    Clock,
    Edit2,
    Gamepad2,
    GraduationCap,
    Medal,
    Save,
    Shuffle,
    Swords,
    Target,
    Timer,
    Trophy,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useNotification } from "../composables/useNotification";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

const { success: notifySuccess, error: notifyError } = useNotification();
const authStore = useAuthStore();

const profile = ref({
  username: "",
  avatar: "",
  createdAt: "",
  stats: {
    totalGames: 0,
    wins: 0,
    bestRank: null,
    avgDuration: null,
  },
});
const recentGames = ref([]);
const loading = ref(true);
const error = ref(null);

const showAvatarPicker = ref(false);
const avatarOptions = ref([]);
const selectedAvatar = ref(null);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(ms) {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  }
  return `${seconds.toString().padStart(2, "0")}s`;
}

function generateRandomAvatar() {
  avatarOptions.value = [];
  for (let i = 0; i < 12; i++) {
    avatarOptions.value.push("User_" + Math.floor(Math.random() * 100000));
  }
  selectedAvatar.value = avatarOptions.value[0];
}

async function saveAvatar() {
  if (!selectedAvatar.value) return;
  try {
    await api.put("/profile/avatar", { avatar: selectedAvatar.value });
    profile.value.avatar = selectedAvatar.value;
    authStore.updateAvatar(selectedAvatar.value);
    showAvatarPicker.value = false;
    notifySuccess("Avatar updated!");
  } catch (err) {
    console.error("Error saving avatar:", err);
    notifyError("Error saving avatar");
  }
}

onMounted(async () => {
  try {
    const res = await api.get("/profile");
    // API returns user directly, not under .profile
    profile.value = res.data;
    // recentGames not supported by current API
    recentGames.value = [];
  } catch (err) {
    console.error("Error fetching profile:", err);
    error.value = "Error loading profile";
  } finally {
    loading.value = false;
  }

  generateRandomAvatar();
});
</script>

<style scoped>
@import '../styles/auth.css';

.profile-content {
  animation: slideUp 0.4s ease-out;
}

/* PROFILE CARD */
.profile-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-2xl);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid var(--color-purple);
  box-shadow: 0 8px 24px rgba(121, 80, 242, 0.3);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.profile-info h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
  font-weight: 800;
}

.join-date {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-gray-600);
  font-size: 1rem;
}

/* AVATAR PICKER */
.avatar-picker {
  padding: var(--space-xl);
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.05),
    rgba(214, 51, 132, 0.05)
  );
  border-radius: var(--radius-lg);
  border: 2px dashed rgba(121, 80, 242, 0.3);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.picker-header h4 {
  color: var(--color-gray-800);
  font-size: 1.1rem;
}

/* STATS SECTION */
.stats-section {
  margin-bottom: var(--space-2xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-gray-800);
  margin-bottom: var(--space-lg);
}

.section-title svg {
  color: var(--color-purple);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.stat-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(121, 80, 242, 0.3);
}

.stat-icon {
  color: var(--color-purple);
  margin-bottom: var(--space-md);
}

.trophy-gold {
  color: #ffd700;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5));
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-sm);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-gray-900);
  font-family: "Courier New", monospace;
}

/* RECENT GAMES */
.recent-games-section {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
}

.games-list {
  display: grid;
  gap: var(--space-md);
}

.game-card {
  background: var(--color-gray-100);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.game-card:hover {
  background: var(--color-gray-200);
  transform: translateX(4px);
}

.game-mode {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  color: var(--color-purple);
  margin-bottom: var(--space-sm);
}

.game-stats-row {
  display: flex;
  gap: var(--space-lg);
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.game-stats-row span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.game-date {
  margin-left: auto;
  opacity: 0.7;
}

.error-message {
  background: #fff5f5;
  color: var(--color-error);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid #ffcccc;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-info h1 {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
