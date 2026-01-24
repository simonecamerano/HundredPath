<template>
  <div class="leaderboard-container">
    <h2>🏆 Classifica Migliori Tempi</h2>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Giocatore</th>
          <th>Punteggio</th>
          <!-- Aggiunto -->
          <th>Tempo</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in leaderboard" :key="entry._id">
          <td>{{ index + 1 }}</td>
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
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";
const leaderboard = ref([]);
const loading = ref(true);
const error = ref(null);
// Helper per formattare ms in mm:ss
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
onMounted(async () => {
  try {
    const res = await api.get("/game/leaderboard");
    leaderboard.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare la classifica";
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.leaderboard-container {
  max-width: 600px;
  margin: 0 auto;
}
.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.leaderboard-table th,
.leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.leaderboard-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>
