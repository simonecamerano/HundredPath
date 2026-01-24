<script setup>
import { computed, onMounted, ref } from "vue";
import Grid from "../components/Grid.vue";
import api from "../services/api"; // Importa Axios
// STATO
const grid = ref(Array(100).fill(0));
const currentNumber = ref(1);
const lastPosition = ref(-1);
const gameId = ref(null); // ID della partita dal server
const undoCount = ref(3);
const loading = ref(false); // Per evitare doppi click
// --- HELPER LOGIC (Resta uguale per validation locale) ---
// (Copia pure le tue funzioni toCoords e isValidMove qui, non cambiano)
const toCoords = (index) => {
  return { x: index % 10, y: Math.floor(index / 10) };
};
const isValidMove = (currentIndex, targetIndex) => {
  /* ... tua logica ... */
  if (currentIndex === -1) return true;
  const start = toCoords(currentIndex);
  const end = toCoords(targetIndex);
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  return (
    (dx === 3 && dy === 0) || (dx === 0 && dy === 3) || (dx === 2 && dy === 2)
  );
};
// --- API & LIFECYCLE ---
onMounted(async () => {
  console.log("Game.vue mounted. Calling API...");
  try {
    loading.value = true;
    const res = await api.post("/game/start");
    console.log("API Success:", res.data);
    gameId.value = res.data.game._id;
    grid.value = res.data.game.grid;
    currentNumber.value = 1;
    lastPosition.value = -1;
  } catch (err) {
    console.error("Errore start game:", err);
    alert(
      "Errore nell'iniziare la partita: " +
        (err.response?.data?.error || err.message),
    );
  } finally {
    loading.value = false;
  }
});
async function handleMove(index) {
  // Validazione Locale (Veloce)
  if (grid.value[index] !== 0) return alert("Cella occupata!");
  if (!isValidMove(lastPosition.value, index))
    return alert("Mossa non valida!");
  if (loading.value) return;
  // Optimistic UI Update (Mostra subito)
  const prevGrid = [...grid.value]; // Backup per rollback se serve
  grid.value[index] = currentNumber.value;
  lastPosition.value = index;
  currentNumber.value++;
  // API Call (Background)
  try {
    await api.post("/game/move", {
      gameId: gameId.value,
      position: index,
    });
  } catch (err) {
    console.error("Errore mossa:", err);
    alert("Errore di sincronizzazione! Ricarica.");
    // Rollback (opzionale, per ora lasciamo stare)
  }
}
async function undo() {
  if (currentNumber.value <= 1 || undoCount.value <= 0) return;
  try {
    const res = await api.post("/game/undo", { gameId: gameId.value });

    // AGGIORNIAMO TUTTO LO STATO DAL SERVER
    // Il server ci restituisce il gioco aggiornato
    const game = res.data.game;

    grid.value = game.grid;
    currentNumber.value = game.currentNumber;
    undoCount.value--;

    // Recuperiamo lastPosition dall'ultima mossa rimasta
    if (game.moves.length > 0) {
      lastPosition.value = game.moves[game.moves.length - 1].position;
    } else {
      lastPosition.value = -1;
    }
  } catch (err) {
    console.error("Errore undo:", err);
  }
}

async function restartGame() {
  if (!confirm("Sicuro di voler ricominciare?")) return;
  try {
    loading.value = true;
    const res = await api.post("/game/start");

    // Reset Stato
    gameId.value = res.data.game._id;
    grid.value = res.data.game.grid;
    currentNumber.value = 1;
    lastPosition.value = -1;
    undoCount.value = 3;
  } catch (err) {
    console.error("Restart failed", err);
  } finally {
    loading.value = false;
  }
}

// CALCOLO MOSSE VALIDE
const validMoves = computed(() => {
  const moves = [];
  for (let i = 0; i < 100; i++) {
    if (grid.value[i] === 0 && isValidMove(lastPosition.value, i)) {
      moves.push(i);
    }
  }
  return moves;
});

// STATO FINE PARTITA
const isVictory = computed(() => currentNumber.value === 100);
const isGameOver = computed(
  () =>
    !isVictory.value &&
    validMoves.value.length === 0 &&
    lastPosition.value !== -1,
);
</script>
<template>
  <div class="game-container">
    <h2>Turno: {{ currentNumber }}</h2>

    <div class="controls">
      <button
        @click="undo"
        :disabled="
          currentNumber <= 1 || undoCount <= 0 || isVictory || isGameOver
        "
      >
        Undo ↩️ ({{ undoCount }})
      </button>
      <button
        @click="restartGame"
        style="margin-left: 10px; background: #ff9800"
      >
        Ricomincia 🔄
      </button>
    </div>

    <Grid
      :grid="grid"
      :validMoves="validMoves"
      :currentPosition="lastPosition"
      @move="handleMove"
    />

    <!-- OVERLAYS -->
    <div v-if="isVictory" class="overlay victory">
      <h3>🏆 VITTORIA! 🏆</h3>
      <p>Hai completato il percorso!</p>
      <button @click="restartGame">Nuova Partita</button>
    </div>

    <div v-if="isGameOver" class="overlay gameover">
      <h3>💀 GAME OVER 💀</h3>
      <p>Nessuna mossa disponibile.</p>
      <button @click="undo" :disabled="undoCount <= 0">Usa Undo</button>
      <button
        @click="restartGame"
        style="margin-left: 10px; background: #ff9800"
      >
        Ricomincia
      </button>
    </div>
  </div>
</template>
<style scoped>
.game-container {
  text-align: center;
}
.controls {
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.overlay h3 {
  font-size: 3rem;
  margin-bottom: 20px;
}
.victory h3 {
  color: #ffd700;
}
.gameover h3 {
  color: #ff4d4f;
}
</style>
