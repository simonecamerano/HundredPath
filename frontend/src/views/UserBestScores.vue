<template>
  <div class="page-wrapper">
    <div class="container-sm">
      <div class="page-header">
        <Sparkles :size="54" class="header-icon" />
        <h1 class="text-gradient">Your Records</h1>
        <p class="subtitle">Your best performances in each mode</p>
      </div>

      <!-- MODE SWITCHER -->
      <div
        class="tab-switcher"
        role="tablist"
        aria-label="Best scores mode switcher"
      >
        <button
          v-for="mode in modes"
          :key="mode.value"
          :class="['tab-btn', { active: activeMode === mode.value }]"
          @click="switchMode(mode.value)"
          role="tab"
          :aria-selected="activeMode === mode.value"
          :aria-label="`View ${mode.label} best scores`"
        >
          <component :is="mode.iconComponent" :size="18" />
          {{ mode.label }}
        </button>
      </div>

      <!-- LOADING/ERROR -->
      <div v-if="loading" class="flex-center" style="min-height: 300px">
        <div class="badge badge-purple">Loading...</div>
      </div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <!-- RECORDS -->
      <div v-else class="records-container">
        <div
          v-if="userBestScores[activeMode].length === 0"
          class="empty-state-card"
        >
          <Target :size="64" style="opacity: 0.3; margin-bottom: 16px" />
          <h3>No records yet</h3>
          <p>
            Complete games in
            {{ modes.find((m) => m.value === activeMode).label }} mode to see
            your records!
          </p>
          <router-link
            :to="`/game?mode=${activeMode}`"
            class="btn btn-gradient"
          >
            <Swords :size="18" />
            Start {{ modes.find((m) => m.value === activeMode).label }} Game
          </router-link>
        </div>

        <div v-else class="records-grid">
          <div
            v-for="(entry, index) in userBestScores[activeMode]"
            :key="entry._id"
            class="record-card"
            :class="{ 'top-record': index === 0 }"
          >
            <div class="record-rank">
              <Trophy
                v-if="entry.globalRank <= 3"
                :size="24"
                :class="'trophy-' + entry.globalRank"
              />
              <span class="rank-text">#{{ entry.globalRank }}</span>
            </div>

            <div class="record-content">
              <div class="record-header">
                <img
                  :src="getAvatarUrl(entry.avatar)"
                  alt="Avatar"
                  class="avatar"
                />
                <div>
                  <p class="username">{{ entry.username }}</p>
                  <p class="date">{{ formatDate(entry.createdAt) }}</p>
                </div>
              </div>

              <div class="record-stats">
                <div class="stat">
                  <Target :size="16" />
                  <span class="stat-label">Score</span>
                  <span class="stat-value">
                    <template v-if="activeMode === 'mastermind'">
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          align-items: flex-start;
                          line-height: 1.2;
                        "
                      >
                        <span>{{
                          entry.currentNumber + (entry.bonusPoints || 0)
                        }}</span>
                        <span
                          v-if="entry.bonusPoints"
                          style="
                            font-size: 0.75rem;
                            color: #6b7280;
                            font-weight: normal;
                          "
                        >
                          ({{ entry.currentNumber }} +
                          <span style="color: #f59f00">{{
                            entry.bonusPoints
                          }}</span
                          >)
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      {{ entry.currentNumber }}
                    </template>
                  </span>
                </div>
                <div class="stat">
                  <Timer :size="16" />
                  <span class="stat-label">Time</span>
                  <span class="stat-value">{{
                    formatDuration(entry.duration)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Sparkles, Swords, Target, Timer, Trophy } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import api from "../services/api";

const modes = [
  { value: "ranked", label: "Ranked", iconComponent: Trophy },
  { value: "mastermind", label: "Mastermind", iconComponent: Target },
];
const activeMode = ref("ranked");
const userBestScores = ref({ ranked: [], mastermind: [] });
const loading = ref(true);
const error = ref(null);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function formatDuration(ms) {
  const totalMs = Math.floor(ms);
  const totalSeconds = Math.floor(totalMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((totalMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
  }
  return `${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function fetchBestScores(mode) {
  try {
    loading.value = true;
    const res = await api.get(`/game/userBestScores?gameMode=${mode}`);
    userBestScores.value[mode] = res.data;
  } catch (err) {
    console.error("Error fetching user best scores:", err);
    error.value = "Error loading records";
  } finally {
    loading.value = false;
  }
}

function switchMode(mode) {
  if (activeMode.value !== mode) {
    activeMode.value = mode;
    if (
      !userBestScores.value[mode] ||
      userBestScores.value[mode].length === 0
    ) {
      fetchBestScores(mode);
    }
  }
}

onMounted(async () => {
  await fetchBestScores("ranked");
});
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.header-icon {
  color: var(--color-pink);
  margin-bottom: var(--space-md);
  filter: drop-shadow(0 0 20px rgba(240, 101, 149, 0.5));
  animation: iconPop 0.5s ease-out;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
  font-weight: 800;
}

.subtitle {
  color: var(--color-gray-700);
  font-size: 1.1rem;
}

.error-message {
  background: #fff5f5;
  color: var(--color-error);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid #ffcccc;
  text-align: center;
}

/* EMPTY STATE */
.empty-state-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.empty-state-card h3 {
  color: var(--color-gray-800);
  margin-bottom: var(--space-sm);
}

.empty-state-card p {
  color: var(--color-gray-600);
  margin-bottom: var(--space-xl);
}

/* RECORDS GRID */
.records-grid {
  display: grid;
  gap: var(--space-lg);
}

.record-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  gap: var(--space-lg);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.record-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.top-record {
  border-color: rgba(121, 80, 242, 0.3);
  box-shadow: var(--shadow-glow-purple);
}

.record-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: var(--space-md);
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.1),
    rgba(214, 51, 132, 0.1)
  );
  border-radius: var(--radius-md);
}

.rank-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-purple);
  margin-top: var(--space-xs);
}

.trophy-1 {
  color: #f59f00; /* Darker Gold/Orange */
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
  margin-bottom: var(--space-xs);
}

.trophy-2 {
  color: #c0c0c0;
  filter: drop-shadow(0 0 4px rgba(192, 192, 192, 0.5));
  margin-bottom: var(--space-xs);
}

.trophy-3 {
  color: #cd7f32;
  filter: drop-shadow(0 0 4px rgba(205, 127, 50, 0.5));
  margin-bottom: var(--space-xs);
}

.record-content {
  flex: 1;
}

.record-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-gray-200);
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-200);
}

.username {
  font-weight: 700;
  color: var(--color-gray-800);
  font-size: 1.1rem;
}

.date {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.record-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-sm);
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
}

.stat svg {
  color: var(--color-purple);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gray-800);
  font-family: "Courier New", monospace;
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

  .record-card {
    flex-direction: column;
    gap: var(--space-md);
  }

  .record-rank {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
}
</style>
