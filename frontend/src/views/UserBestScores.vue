<template>
  <div class="userBestScores-container">
    <h2>🏆 I tuoi Migliori Tempi</h2>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="userBestScores-table">
      <thead>
        <tr>
          <th>Pos. Globale</th>
          <th>Avatar</th>
          <th>Giocatore</th>
          <th>Punteggio</th>
          <!-- Aggiunto -->
          <th>Tempo</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in userBestScores" :key="entry._id">
          <td># {{ entry.globalRank }}</td>
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

// Helper per formattare ms in mm:ss
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
onMounted(async () => {
  try {
    const res = await api.get("/game/userBestScores");
    userBestScores.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare i migliori tempi";
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped>
.userBestScores-container {
  max-width: 600px;
  margin: 0 auto;
}
.userBestScores-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 50px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.userBestScores-table th,
.userBestScores-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.userBestScores-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>
