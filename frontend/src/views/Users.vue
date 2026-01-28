<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="page-header">
        <Users :size="48" class="header-icon" />
        <h1 class="text-gradient">HundredPath Community</h1>
        <p class="subtitle">
          <UserCheck :size="18" />
          {{ users.length }} registered players
        </p>
      </div>

      <div v-if="loading" class="flex-center" style="min-height: 400px">
        <div class="badge badge-purple">Loading...</div>
      </div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <div v-else class="users-grid">
        <div v-for="user in users" :key="user._id" class="user-card card-hover">
          <div class="user-header">
            <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="avatar" />
            <div class="user-info">
              <h3 class="username">{{ user.username }}</h3>
              <p class="join-date">
                <Calendar :size="14" />
                {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>

          <div class="user-stats">
            <div class="stat-row">
              <span class="stat-label">
                <Gamepad2 :size="14" />
                Games
              </span>
              <span class="stat-value">{{ user.totalGames }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">
                <Trophy :size="14" />
                Wins
              </span>
              <span class="stat-value">{{ user.wins }}</span>
            </div>
            <div v-if="user.bestRank" class="stat-row best-rank">
              <span class="stat-label">
                <Medal :size="14" />
                Best Rank
              </span>
              <span class="stat-value">
                <Trophy
                  v-if="user.bestRank <= 3"
                  :size="16"
                  :class="'trophy-' + user.bestRank"
                />
                #{{ user.bestRank }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
    Calendar,
    Gamepad2,
    Medal,
    Trophy,
    UserCheck,
    Users,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import api from "../services/api";

const users = ref([]);
const loading = ref(true);
const error = ref(null);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

onMounted(async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare gli utenti";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.header-icon {
  color: var(--color-teal);
  margin-bottom: var(--space-md);
  filter: drop-shadow(0 0 20px rgba(32, 201, 151, 0.5));
  animation: iconPop 0.5s ease-out;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
  font-weight: 800;
}

.subtitle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-gray-700);
  font-size: 1.1rem;
  background: white;
  padding: var(--space-sm) var(--space-lg);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
}

.error-message {
  background: #fff5f5;
  color: var(--color-error);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid #ffcccc;
  text-align: center;
}

/* USERS GRID */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
  animation: fadeIn 0.4s ease-in;
}

.user-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: rgba(32, 201, 151, 0.3);
  box-shadow: var(--shadow-glow-teal);
}

.user-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--color-gray-200);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.user-card:hover .avatar {
  border-color: var(--color-teal);
  box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.2);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 4px;
}

.join-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

/* USER STATS */
.user-stats {
  display: grid;
  gap: var(--space-sm);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.stat-row:hover {
  background: var(--color-gray-200);
}

.stat-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 600;
}

.stat-label svg {
  color: var(--color-purple);
}

.stat-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-gray-900);
  font-family: "Courier New", monospace;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.best-rank {
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.1),
    rgba(255, 215, 0, 0.05)
  );
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.trophy-1 {
  color: #ffd700;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
}

.trophy-2 {
  color: #c0c0c0;
  filter: drop-shadow(0 0 4px rgba(192, 192, 192, 0.5));
}

.trophy-3 {
  color: #cd7f32;
  filter: drop-shadow(0 0 4px rgba(205, 127, 50, 0.5));
}

@keyframes iconPop {
  0% {
    transform: scale(0) rotate(-180deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@media (max-width: 1100px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .users-grid {
    grid-template-columns: 1fr;
  }
}
</style>
