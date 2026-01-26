<template>
  <div class="leaderboard-container">
    <h2>🏆 Classifica Migliori Tempi</h2>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="leaderboard-table">
      <thead>
        <tr>
          <th>Posizione</th>
          <th>Avatar</th>
          <th>Giocatore</th>
          <th>Punteggio</th>
          <!-- Aggiunto -->
          <th>Tempo</th>
          <th>Data</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="entry in leaderboardData.top10" :key="entry._id">
          <td>
            # {{ entry.globalRank }}
            <span class="medal">{{ getMedal(entry.globalRank) }}</span>
          </td>
          <td>
            <img :src="getAvatarUrl(entry.avatar)" alt="Avatar" />
          </td>
          <td>{{ entry.username }}</td>
          <td>{{ entry.currentNumber }}</td>
          <!-- Aggiunto -->
          <td>{{ formatDuration(entry.duration) }}</td>
          <td>
            {{
              new Date(
                entry.completedAt || entry.updatedAt,
              ).toLocaleDateString()
            }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- SEZIONE POSIZIONE UTENTE (se fuori Top 10) -->
    <div v-if="showUserRank" class="user-rank-section">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Posizione</th>
            <th>Avatar</th>
            <th>Giocatore</th>
            <th>Punteggio</th>
            <!-- Aggiunto -->
            <th>Tempo</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr class="highlight-user">
            <td>
              # {{ leaderboardData.userBest.globalRank }}
              <span class="medal">{{
                getMedal(leaderboardData.userBest.globalRank)
              }}</span>
            </td>
            <td>
              <img
                :src="getAvatarUrl(leaderboardData.userBest.avatar)"
                alt="Avatar"
              />
            </td>
            <td>{{ leaderboardData.userBest.username }}</td>
            <td>{{ leaderboardData.userBest.currentNumber }}</td>
            <td>{{ formatDuration(leaderboardData.userBest.duration) }}</td>
            <td>
              {{
                new Date(
                  leaderboardData.userBest.completedAt ||
                    leaderboardData.userBest.updatedAt,
                ).toLocaleDateString()
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../services/api";
const leaderboardData = ref({ top10: [], userBest: null });
const loading = ref(true);
const error = ref(null);

const showUserRank = computed(() => {
  if (!leaderboardData.value.userBest) return false;
  // Mostra solo se il rank è > 10
  return leaderboardData.value.userBest.globalRank > 10;
});

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

// Helper per formattare ms in ss.cc (o m ss.cc)
function formatDuration(ms) {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}m ${seconds.toString().padStart(2, "0")}.${centis
      .toString()
      .padStart(2, "0")}s`;
  }
  return `${seconds.toString().padStart(2, "0")}.${centis
    .toString()
    .padStart(2, "0")}s`;
}

// Helper per visualizzare medaglie
function getRankDisplay(rank) {
  return `# ${rank}`;
}

// Helper per visualizzare medaglie
function getMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
}

onMounted(async () => {
  try {
    const res = await api.get("/game/leaderboard");
    leaderboardData.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare la classifica";
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.medal {
  font-size: 1.8rem; /* Medaglie più grandi! */
  margin-left: 5px;
  vertical-align: middle;
}
.leaderboard-container {
  max-width: 600px;
  margin: 0 auto;
}
.leaderboard-table {
  width: 100%;
  border-collapse: separate; /* Required for border-radius on table */
  border-spacing: 0;
  margin-top: 50px;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Softer shadow */
  border-radius: 16px; /* Rounded corners */
  overflow: hidden;
}
.leaderboard-table th,
.leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle; /* Allinea icone e testo */
}
.leaderboard-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}
.user-rank-section {
  margin-top: 0px;
  padding-top: 20px;
}
.highlight-user {
  font-weight: bold;
}
</style>
