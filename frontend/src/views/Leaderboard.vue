<template>
  <div class="page-wrapper">
    <div class="container">
      <div class="leaderboard-header">
        <Trophy :size="48" class="header-icon" />
        <h1 class="text-gradient">Leaderboards</h1>
        <p class="subtitle">Climb to the global top</p>
      </div>

      <!-- MODE SWITCHER -->
      <div class="mode-switcher-bar">
        <div
          class="tab-switcher mode-switcher"
          role="tablist"
          aria-label="Leaderboard mode switcher"
        >
          <button
            v-for="mode in modes"
            :key="mode.value"
            :class="['tab-btn', { active: activeMode === mode.value }]"
            @click="switchMode(mode.value)"
            role="tab"
            :aria-selected="activeMode === mode.value"
            :aria-label="`View ${mode.label} leaderboard`"
          >
            <component :is="mode.iconComponent" :size="18" />
            {{ mode.label }}
          </button>
        </div>
      </div>

      <!-- TAB SWITCHER -->
      <div
        class="tab-switcher period-switcher"
        role="tablist"
        aria-label="Leaderboard time periods"
      >
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
            <!-- Top 10 Table -->
            <div class="table-wrapper">
              <table
                class="table"
                role="table"
                :aria-label="`${period.label} leaderboard top 10`"
              >
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
                    v-for="entry in leaderboards[activeMode][period.value]
                      ?.top10 || []"
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
                      <router-link
                        :to="`/user/${entry.username}`"
                        class="username-link"
                      >
                        {{ entry.username }}
                      </router-link>
                    </td>
                    <td class="score-cell">
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
                    </td>
                    <td class="time-cell">
                      {{ formatDuration(entry.duration) }}
                    </td>
                  </tr>
                  <tr
                    v-if="
                      leaderboards[activeMode][period.value].top10.length === 0
                    "
                  >
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
                leaderboards[activeMode][period.value].userBest &&
                leaderboards[activeMode][period.value].userBest.globalRank > 10
              "
              class="user-rank-section"
            >
              <h4 class="section-title">
                <User :size="18" />
                Your Position
              </h4>
              <div class="user-rank-card">
                <div class="rank-badge">
                  #{{
                    leaderboards[activeMode][period.value].userBest.globalRank
                  }}
                </div>
                <img
                  :src="
                    getAvatarUrl(
                      leaderboards[activeMode][period.value].userBest.avatar,
                    )
                  "
                  alt="Avatar"
                  class="avatar"
                />
                <div class="user-stats">
                  <p class="username">
                    {{
                      leaderboards[activeMode][period.value].userBest.username
                    }}
                  </p>
                  <div class="stats-row">
                    <span>
                      <Target :size="14" />
                      {{
                        leaderboards[activeMode][period.value].userBest
                          .currentNumber
                      }}
                    </span>
                    <span>
                      <Timer :size="14" />
                      {{
                        formatDuration(
                          leaderboards[activeMode][period.value].userBest
                            .duration,
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

const modes = [
  { value: "ranked", label: "Ranked", iconComponent: Trophy },
  { value: "mastermind", label: "Mastermind", iconComponent: Target },
];

const activeMode = ref("ranked");
const activePeriod = ref("all");

// Structure: { ranked: { all: {...}, week: {...}, day: {...} }, mastermind: { ... } }
const leaderboards = ref({
  ranked: {
    all: { top10: [], userBest: null },
    week: { top10: [], userBest: null },
    day: { top10: [], userBest: null },
  },
  mastermind: {
    all: { top10: [], userBest: null },
    week: { top10: [], userBest: null },
    day: { top10: [], userBest: null },
  },
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

async function fetchLeaderboards(mode) {
  try {
    loading.value = true;
    const [allRes, weekRes, dayRes] = await Promise.all([
      api.get(`/game/leaderboard?period=all&gameMode=${mode}`),
      api.get(`/game/leaderboard?period=week&gameMode=${mode}`),
      api.get(`/game/leaderboard?period=day&gameMode=${mode}`),
    ]);
    leaderboards.value[mode] = {
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
}

function switchMode(mode) {
  if (activeMode.value !== mode) {
    activeMode.value = mode;
    // Only fetch if not already loaded
    if (
      !leaderboards.value[mode] ||
      !leaderboards.value[mode].all.top10.length
    ) {
      fetchLeaderboards(mode);
    }
  }
}

onMounted(async () => {
  await fetchLeaderboards("ranked");
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
}

.rank-cell svg {
  margin-left: 4px;
}

.rank-number {
  font-weight: 700;
  color: var(--color-gray-800);
}

.trophy-1 {
  color: #f59f00; /* Darker Gold/Orange */
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

/* FILTERS & LAYOUT */
.hidden {
  display: none !important;
}

.leaderboards-grid {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.leaderboard-column {
  width: 100%;
  animation: fadeIn 0.3s ease;
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

@media (max-width: 1100px) {
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
