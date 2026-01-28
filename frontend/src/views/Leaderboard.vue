<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="leaderboard-header">
        <Trophy :size="48" class="header-icon" />
        <h1 class="text-gradient">Leaderboards</h1>
        <p class="subtitle">Climb to the global top</p>
      </div>

      <!-- TAB SWITCHER -->
      <div class="tab-switcher" role="tablist" aria-label="Leaderboard time periods">
        <button
          v-for="period in periods"
          :key="period.value"
          :class="['tab-btn', { active: activePeriod === period.value }]"
          @click="activePeriod = period.value"
          role="tab"
          :aria-selected="activePeriod === period.value"
          :aria-controls="`${period.value}-leaderboard`"
          :aria-label="`View ${period.label} leaderboard`"
        >
          <component :is="period.iconComponent" :size="18" />
          {{ period.label }}
        </button>
      </div>

      <!-- LOADING/ERROR -->
      <div v-if="loading" class="flex-center" style="min-height: 300px">
        <div class="badge badge-purple">Loading...</div>
      </div>
      <div v-else-if="error" class="error-message">{{ error }}</div>

      <!-- LEADERBOARDS GRID -->
      <div v-else class="leaderboards-grid">
        <div
          v-for="period in periods"
          :key="period.value"
          :class="[
            'leaderboard-column',
            { hidden: activePeriod !== period.value },
          ]"
        >
          <div class="leaderboard-card">
            <div class="card-header">
              <component :is="period.iconComponent" :size="24" />
              <h3>{{ period.label }}</h3>
            </div>

            <!-- Top 10 Table -->
            <div class="table-wrapper">
              <table class="table" role="table" :aria-label="`${period.label} leaderboard top 10`">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Avatar</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="entry in leaderboards[period.value]?.top10 || []"
                    :key="entry._id"
                    :class="{ 'podium-row': entry.globalRank <= 3 }"
                  >
                    <td class="rank-cell">
                      <span class="rank-number">#{{ entry.globalRank }}</span>
                      <component
                        v-if="entry.globalRank <= 3"
                        :is="Trophy"
                        :size="16"
                        :class="'trophy-' + entry.globalRank"
                      />
                    </td>
                    <td>
                      <img
                        :src="getAvatarUrl(entry.avatar)"
                        :alt="`${entry.username}'s avatar`"
                        class="avatar"
                      />
                    </td>
                    <td class="username-cell">
                      <router-link :to="`/user/${entry.username}`" class="username-link">
                        {{ entry.username }}
                      </router-link>
                    </td>
                    <td class="score-cell">{{ entry.currentNumber }}</td>
                    <td class="time-cell">
                      {{ formatDuration(entry.duration) }}
                    </td>
                  </tr>
                  <tr v-if="leaderboards[period.value].top10.length === 0">
                    <td colspan="5" class="empty-state">
                      <Target
                        :size="32"
                        style="opacity: 0.3; margin-bottom: 8px"
                      />
                      <p>No games completed</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- User Best (se fuori Top 10) -->
            <div
              v-if="
                leaderboards[period.value].userBest &&
                leaderboards[period.value].userBest.globalRank > 10
              "
              class="user-rank-section"
            >
              <h4 class="section-title">
                <User :size="18" />
                Your Position
              </h4>
              <div class="user-rank-card">
                <div class="rank-badge">
                  #{{ leaderboards[period.value].userBest.globalRank }}
                </div>
                <img
                  :src="
                    getAvatarUrl(leaderboards[period.value].userBest.avatar)
                  "
                  alt="Avatar"
                  class="avatar"
                />
                <div class="user-stats">
                  <p class="username">
                    {{ leaderboards[period.value].userBest.username }}
                  </p>
                  <div class="stats-row">
                    <span>
                      <Target :size="14" />
                      {{ leaderboards[period.value].userBest.currentNumber }}
                    </span>
                    <span>
                      <Timer :size="14" />
                      {{
                        formatDuration(
                          leaderboards[period.value].userBest.duration,
                        )
                      }}
                    </span>
                  </div>
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
import {
    BarChart3,
    Calendar,
    Flame,
    Target,
    Timer,
    Trophy,
    User,
} from "lucide-vue-next";
import { onMounted, ref } from "vue";
import api from "../services/api";

const periods = [
  { value: "all", label: "Overall", iconComponent: BarChart3 },
  { value: "week", label: "Weekly", iconComponent: Calendar },
  { value: "day", label: "Daily", iconComponent: Flame },
];

const activePeriod = ref("all");
const leaderboards = ref({
  all: { top10: [], userBest: null },
  week: { top10: [], userBest: null },
  day: { top10: [], userBest: null },
});
const loading = ref(true);
const error = ref(null);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function formatDuration(ms) {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
  }
  return `${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
}

onMounted(async () => {
  try {
    loading.value = true;
    // Fetch all three periods
    const [allRes, weekRes, dayRes] = await Promise.all([
      api.get("/game/leaderboard?period=all"),
      api.get("/game/leaderboard?period=week"),
      api.get("/game/leaderboard?period=day"),
    ]);
    leaderboards.value = {
      all: allRes.data,
      week: weekRes.data,
      day: dayRes.data,
    };
  } catch (err) {
    console.error("Error fetching leaderboards:", err);
    error.value = "Error loading leaderboards";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.leaderboard-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.header-icon {
  color: #ffd700;
  margin-bottom: var(--space-md);
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  animation: iconPop 0.5s ease-out;
}

.leaderboard-header h1 {
  font-size: 3rem;
  margin-bottom: var(--space-sm);
  font-weight: 800;
}

.subtitle {
  color: var(--color-gray-600);
  font-size: 1.2rem;
}

/* TAB SWITCHER */
.tab-switcher {
  display: flex;
  gap: var(--space-sm);
  justify-content: center;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px 24px;
  margin-bottom: 40px;
  background: white;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  color: var(--color-gray-700);
  transition: all 0.3s ease;
}

.tab-btn:hover {
  border-color: var(--color-purple);
  background: rgba(121, 80, 242, 0.05);
}

.tab-btn.active {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  box-shadow: var(--shadow-glow-purple);
}

/* LEADERBOARDS GRID */
.leaderboards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.leaderboard-column.hidden {
  display: none;
}

.leaderboard-card {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideUp 0.4s ease-out;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--gradient-primary);
  color: white;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

/* TABLE */
.table-wrapper {
  overflow-x: auto;
}

.table {
  margin: 0 auto;
  box-shadow: none;
  border-radius: 0;
  width: 100%;
}

.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.table thead {
  background: var(--gradient-secondary);
}

.podium-row {
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0.05),
    rgba(255, 215, 0, 0.01)
  );
  font-weight: 600;
}

.rank-cell {
  white-space: nowrap;
}

.rank-cell .rank-number,
.rank-cell svg {
  display: inline-block;
  vertical-align: middle;
}

.rank-cell svg {
  margin-left: 4px;
}

.rank-number {
  font-weight: 700;
  color: var(--color-gray-800);
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-gray-200);
}

.username-cell {
  text-align: left;
  padding-left: 12px;
  font-weight: 600;
  color: var(--color-gray-800);
}

.username-link {
  color: var(--color-purple);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
}

.username-link:hover {
  color: var(--color-pink);
  text-decoration: underline;
}

.score-cell {
  font-weight: 700;
  color: var(--color-purple);
  font-family: "Courier New", monospace;
}

.time-cell {
  font-family: "Courier New", monospace;
  color: var(--color-gray-600);
}

.empty-state {
  text-align: center;
  padding: var(--space-2xl) !important;
  color: var(--color-gray-500);
}

/* USER RANK SECTION */
.user-rank-section {
  padding: var(--space-lg);
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.05),
    rgba(214, 51, 132, 0.05)
  );
  border-top: 2px solid var(--color-gray-200);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 1.1rem;
  color: var(--color-gray-800);
  margin-bottom: var(--space-md);
}

.user-rank-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  background: white;
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.rank-badge {
  background: var(--gradient-primary);
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}

.user-stats {
  flex: 1;
}

.user-stats .username {
  font-weight: 700;
  color: var(--color-gray-800);
  margin-bottom: var(--space-xs);
}

.stats-row {
  display: flex;
  gap: var(--space-lg);
  font-size: 0.9rem;
  color: var(--color-gray-600);
}

.stats-row span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ANIMATIONS */
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

/* RESPONSIVE - Rimosso layout 3 colonne desktop, manteniamo i tab */

@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-sm);
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .leaderboard-header h1 {
    font-size: 2rem;
  }

  .leaderboard-card {
    border-radius: var(--radius-lg);
    width: 100%;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    font-size: 0.75rem;
    min-width: 100%;
  }

  .table th,
  .table td {
    padding: 8px 6px;
    white-space: nowrap;
  }

  /* Removed rank-cell override to use desktop style (inline-block) */

  .avatar {
    width: 28px;
    height: 28px;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 0.875rem;
    margin: 0;
  }
}
</style>
