<template>
  <div class="profile-container">
    <h2>👤 Il Mio Profilo</h2>

    <div v-if="loading" class="loading">Caricamento...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="profile-content">
      <!-- SEZIONE AVATAR & INFO -->
      <div class="profile-header">
        <img
          :src="getAvatarUrl(profile.avatar)"
          alt="Avatar"
          class="profile-avatar"
        />
        <h3>{{ profile.username }}</h3>
        <p class="join-date">Membro dal {{ formatDate(profile.createdAt) }}</p>

        <button
          @click="showAvatarPicker = !showAvatarPicker"
          class="btn-change-avatar"
        >
          {{ showAvatarPicker ? "Chiudi" : "✏️ Cambia Avatar" }}
        </button>
      </div>

      <!-- AVATAR PICKER (togglabile) -->
      <div v-if="showAvatarPicker" class="avatar-picker">
        <h4>Scegli un nuovo avatar:</h4>
        <button @click="generateRandomAvatar" class="btn-random">
          🎲 Random Avatar
        </button>
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
          class="btn-save"
          :disabled="!selectedAvatar"
        >
          💾 Salva Avatar
        </button>
      </div>

      <!-- STATISTICHE -->
      <div class="stats-section">
        <h3>📊 Le Tue Statistiche</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎮</div>
            <div class="stat-label">Partite Giocate</div>
            <div class="stat-value">{{ profile.stats.totalGames }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-label">Vittorie</div>
            <div class="stat-value">{{ profile.stats.wins }}</div>
          </div>
          <div class="stat-card" v-if="profile.stats.bestRank">
            <div class="stat-icon">
              {{ getRankIcon(profile.stats.bestRank) }}
            </div>
            <div class="stat-label">Miglior Posizione</div>
            <div class="stat-value"># {{ profile.stats.bestRank }}</div>
          </div>
          <div class="stat-card" v-if="profile.stats.avgDuration">
            <div class="stat-icon">⏱️</div>
            <div class="stat-label">Tempo Medio</div>
            <div class="stat-value">
              {{ formatDuration(profile.stats.avgDuration) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const profile = ref({});
const loading = ref(true);
const error = ref(null);
const showAvatarPicker = ref(false);
const selectedAvatar = ref(null);

const avatarOptions = ref([
  "Freddy",
  "Felix",
  "Aneka",
  "Willow",
  "Midnight",
  "Shadow",
  "Daria",
  "Simone",
  "Marina",
  "Leo",
  "Riccardo",
  "Serena",
  "Luna",
  "Kai",
  "Zara",
  "Atlas",
  "Nova",
  "Phoenix",
]);

function getAvatarUrl(seed) {
  const safeSeed = seed || "shape_default";
  const style = safeSeed.startsWith("shape_") ? "shapes" : "adventurer";
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${safeSeed}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
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
  return `${seconds.toString().padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
}

function getRankIcon(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🏅";
}

function generateRandomAvatar() {
  avatarOptions.value = [];
  for (let i = 0; i < 18; i++) {
    avatarOptions.value.push("User_" + Math.floor(Math.random() * 100000));
  }
  selectedAvatar.value = avatarOptions.value[0];
}

async function saveAvatar() {
  try {
    await api.put("/profile/avatar", { avatar: selectedAvatar.value });
    profile.value.avatar = selectedAvatar.value;
    authStore.user.avatar = selectedAvatar.value; // Update store
    showAvatarPicker.value = false;
    alert("Avatar aggiornato con successo!");
  } catch (err) {
    console.error(err);
    alert("Errore nell'aggiornamento dell'avatar");
  }
}

onMounted(async () => {
  try {
    const res = await api.get("/profile");
    profile.value = res.data;
    selectedAvatar.value = profile.value.avatar;
  } catch (err) {
    console.error(err);
    error.value = "Impossibile caricare il profilo";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.profile-header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
  color: white;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid white;
  margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.profile-header h3 {
  margin: 10px 0 5px;
  font-size: 1.8rem;
}

.join-date {
  opacity: 0.9;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.btn-change-avatar {
  background: white;
  color: #007bff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.btn-change-avatar:hover {
  transform: scale(1.05);
}

/* AVATAR PICKER */
.avatar-picker {
  padding: 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.avatar-picker h4 {
  margin-bottom: 15px;
  color: #333;
}

.btn-random {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.btn-random:hover {
  background: #5a6268;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.avatar-option {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s,
    border-color 0.2s;
  background: #eee;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  transform: scale(1.1);
}

.avatar-option img {
  width: 100%;
  height: 100%;
}

.btn-save {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* STATISTICHE */
.stats-section {
  padding: 40px 30px;
}

.stats-section h3 {
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #dc3545;
}
</style>
