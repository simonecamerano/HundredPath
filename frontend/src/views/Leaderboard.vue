<template>
  <div class="leaderboards-container">
    <h2>🏆 Classifiche</h2>

    <!-- TAB SWITCHER (Mobile) -->
    <div class="tab-switcher">
      <button
        v-for="period in periods"
        :key="period.value"
        :class="['tab-btn', { active: activePeriod === period.value }]"
        @click="activePeriod = period.value"
      >
        {{ period.icon }} {{ period.label }}
      </button>
    </div>

    <!-- LOADING/ERROR -->
    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- LEADERBOARDS GRID (Desktop: 3 colonne, Mobile: mostra solo quella attiva) -->
    <div v-else class="leaderboards-grid">
      <div
        v-for="period in periods"
        :key="period.value"
        :class="[
          'leaderboard-column',
          { hidden: activePeriod !== period.value },
        ]"
      >
        <h3 class="period-title">{{ period.icon }} {{ period.label }}</h3>

        <!-- Top 10 -->
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Avatar</th>
              <th>Giocatore</th>
              <th>Punteggio</th>
              <th>Tempo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="entry in leaderboards[period.value].top10"
              :key="entry._id"
            >
              <td>
                # {{ entry.globalRank }}
                <span class="medal">{{ getMedal(entry.globalRank) }}</span>
              </td>
              <td>
                <img
                  :src="getAvatarUrl(entry.avatar)"
                  alt="Avatar"
                  class="avatar"
                />
              </td>
              <td>{{ entry.username }}</td>
              <td>{{ entry.currentNumber }}</td>
              <td>{{ formatDuration(entry.duration) }}</td>
            </tr>
            <tr v-if="leaderboards[period.value].top10.length === 0">
              <td colspan="5" class="empty-state">
                Nessuna partita completata
              </td>
            </tr>
          </tbody>
        </table>

        <!-- User Best (se fuori Top 10) -->
        <div
          v-if="
            leaderboards[period.value].userBest &&
            leaderboards[period.value].userBest.globalRank > 10
          "
          class="user-rank-section"
        >
          <h4>La Tua Posizione</h4>
          <table class="leaderboard-table">
            <tbody>
              <tr class="highlight-user">
                <td>
                  # {{ leaderboards[period.value].userBest.globalRank }}
                  <span class="medal">{{
                    getMedal(leaderboards[period.value].userBest.globalRank)
                  }}</span>
                </td>
                <td>
                  <img
                    :src="
                      getAvatarUrl(leaderboards[period.value].userBest.avatar)
                    "
                    alt="Avatar"
                    class="avatar"
                  />
                </td>
                <td>{{ leaderboards[period.value].userBest.username }}</td>
                <td>{{ leaderboards[period.value].userBest.currentNumber }}</td>
                <td>
                  {{
                    formatDuration(leaderboards[period.value].userBest.duration)
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";

const periods = [
  { value: "all", label: "Generale", icon: "📊" },
  { value: "week", label: "Settimanale", icon: "📅" },
  { value: "day", label: "Giornaliera", icon: "🔥" },
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

function getMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

onMounted(async () => {
  try {
    // Fetch tutte e 3 le classifiche in parallelo
    const [allTime, weekly, daily] = await Promise.all([
      api.get("/game/leaderboard?period=all"),
      api.get("/game/leaderboard?period=week"),
      api.get("/game/leaderboard?period=day"),
    ]);

    leaderboards.value.all = allTime.data;
    leaderboards.value.week = weekly.data;
    leaderboards.value.day = daily.data;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare le classifiche";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.leaderboards-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
}

/* TAB SWITCHER (Solo su mobile) */
.tab-switcher {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #007bff;
}

.tab-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* LEADERBOARDS GRID */
.leaderboards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.leaderboard-column {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.period-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.3rem;
}

/* TABLE */
.leaderboard-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 12px;
  overflow: hidden;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.leaderboard-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #6c757d;
}

.leaderboard-table tbody tr:last-child td {
  border-bottom: none;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.medal {
  font-size: 1.5rem;
  margin-left: 5px;
  vertical-align: middle;
}

.empty-state {
  text-align: center;
  color: #adb5bd;
  font-style: italic;
  padding: 40px !important;
}

/* USER RANK */
.user-rank-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px dashed #e9ecef;
}

.user-rank-section h4 {
  margin-bottom: 10px;
  color: #007bff;
  font-size: 0.9rem;
  text-align: center;
}

.highlight-user {
  background: #f0f8ff;
  font-weight: bold;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #dc3545;
}

/* Nascondi colonne non attive */
.leaderboard-column.hidden {
  display: none;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .leaderboards-container {
    padding: 10px;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .tab-switcher {
    gap: 5px;
    margin-bottom: 15px;
  }

  .tab-btn {
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .leaderboard-column {
    padding: 15px;
  }

  .period-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  /* Horizontal scroll for table */
  .leaderboard-table {
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .leaderboard-table thead,
  .leaderboard-table tbody {
    display: table;
    width: 100%;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 8px 6px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }

  .medal {
    font-size: 1.4rem;
  }

  .user-rank-section h4 {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }

  .tab-btn {
    font-size: 0.75rem;
    padding: 6px 10px;
  }

  .leaderboard-column {
    padding: 10px;
  }

  .period-title {
    font-size: 1rem;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding: 6px 4px;
    font-size: 0.75rem;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }

  .medal {
    font-size: 1.2rem;
  }
}
</style>
