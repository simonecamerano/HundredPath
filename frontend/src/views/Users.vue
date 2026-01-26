<template>
  <div class="users-container">
    <h2>👥 Community HundredPath</h2>
    <p class="subtitle">{{ users.length }} giocatori registrati</p>
    <div v-if="loading">Caricamento...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="users-grid">
      <div v-for="user in users" :key="user._id" class="user-card">
        <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="avatar" />
        <h3>{{ user.username }}</h3>
        <p class="join-date">Membro dal {{ formatDate(user.createdAt) }}</p>

        <!-- STATISTICHE -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Partite</span>
            <span class="stat-value">{{ user.totalGames }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Vittorie</span>
            <span class="stat-value">{{ user.wins }}</span>
          </div>
          <div v-if="user.bestRank" class="stat-item best-rank">
            <span class="stat-label">Miglior Rank</span>
            <span class="stat-value">
              <span class="medal">{{ getMedal(user.bestRank) }}</span> #{{
                user.bestRank
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
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
  return new Date(dateString).toLocaleDateString("it-IT", {
    month: "short",
    year: "numeric",
  });
}

function getMedal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "";
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
.users-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}
.subtitle {
  color: #6c757d;
  margin-bottom: 30px;
  text-align: center;
}
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}
.user-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s;
  border: 1px solid #f1f3f5;
}
.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 3px solid #007bff;
}
.user-card h3 {
  margin: 10px 0 5px;
  color: #333;
  font-size: 1.1rem;
}
.join-date {
  font-size: 0.8rem;
  color: #adb5bd;
  margin-bottom: 15px;
}

/* STATISTICHE */
.stats {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}
.stat-label {
  color: #6c757d;
  font-weight: 500;
}
.stat-value {
  color: #333;
  font-weight: bold;
}
.best-rank .stat-value {
  color: #007bff;
  font-size: 0.95rem;
}
.medal {
  font-size: 1.5rem;
  vertical-align: middle;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {
  .users-container {
    padding: 10px;
  }

  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  .user-card {
    padding: 15px;
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-width: 2px;
  }

  .user-card h3 {
    font-size: 1rem;
  }

  .join-date {
    font-size: 0.7rem;
  }

  .stat-item {
    font-size: 0.75rem;
  }

  .medal {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .users-grid {
    grid-template-columns: 1fr;
  }

  .user-card {
    padding: 20px;
  }

  .avatar {
    width: 70px;
    height: 70px;
  }
}
</style>
