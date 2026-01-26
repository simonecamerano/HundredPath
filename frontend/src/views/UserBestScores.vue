<template>
  <div class="leaderboards-container">
    <h2>🏆 I tuoi risultati</h2>

    <!-- LOADING/ERROR -->
    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- SINGLE LEADERBOARD (no tabs) -->
    <div v-else class="leaderboards-grid">
      <div class="leaderboard-column">
        <!-- Records Table -->
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
            <tr v-for="entry in userBestScores" :key="entry._id">
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
            <tr v-if="userBestScores.length === 0">
              <td colspan="5" class="empty-state">
                Nessun record in modalità Ranked
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";

const userBestScores = ref([]);
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

function getMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

onMounted(async () => {
  try {
    const res = await api.get("/game/userBestScores");
    userBestScores.value = res.data;
  } catch (err) {
    console.error("Error fetching user best scores:", err);
    error.value = "Errore nel caricamento dei record";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Copied from Leaderboard.vue */
.leaderboards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  color: #333;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
}

.error {
  color: #dc3545;
}

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
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #007bff;
}

.leaderboard-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
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
  color: #495057;
}

.leaderboard-table tbody tr:hover {
  background-color: #f8f9fa;
}

.leaderboard-table tbody tr:last-child td {
  border-bottom: none;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.medal {
  font-size: 1.8rem;
  margin-left: 5px;
  vertical-align: middle;
}

.empty-state {
  text-align: center;
  color: #adb5bd;
  font-style: italic;
  padding: 40px !important;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .leaderboards-container {
    padding: 10px;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .leaderboard-column {
    padding: 15px;
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
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.3rem;
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
}
</style>
