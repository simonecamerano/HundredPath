<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Grid from "../components/Grid.vue";
import api from "../services/api";

const router = useRouter();

const grid = ref(Array(100).fill(0));
const currentNumber = ref(1);
const lastPosition = ref(-1);
const gameId = ref(null);
const undoCount = ref(3);
const loading = ref(false);
const isGameActive = ref(false); // La partita è iniziata (timer attivo)?

// TIMER
const startTime = ref(null);
const elapsedTime = ref("00:00");
let timerInterval = null;

const toCoords = (index) => {
  return { x: index % 10, y: Math.floor(index / 10) };
};

const isValidMove = (currentIndex, targetIndex) => {
  if (currentIndex === -1) return true;
  const start = toCoords(currentIndex);
  const end = toCoords(targetIndex);
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  return (
    (dx === 3 && dy === 0) || (dx === 0 && dy === 3) || (dx === 2 && dy === 2)
  );
};

function startTimer() {
  stopTimer();
  startTime.value = Date.now();
  timerInterval = setInterval(() => {
    const diff = Math.floor((Date.now() - startTime.value) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    elapsedTime.value = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

onMounted(async () => {
  // Carichiamo i dati, ma NON facciamo partire il gioco
  await initGame();
});

onUnmounted(() => {
  stopTimer();
});

async function initGame() {
  try {
    loading.value = true;
    const res = await api.post("/game/start");

    const game = res.data.game;
    gameId.value = game._id;
    grid.value = game.grid;
    currentNumber.value = game.currentNumber;

    const startPos = game.grid.findIndex((n) => n === 1);
    lastPosition.value = startPos;

    undoCount.value = 3;
    isGameActive.value = false; // Aspettiamo il click su START
    elapsedTime.value = "00:00"; // Reset grafico
  } catch (err) {
    console.error("Errore start game:", err);
    alert("Errore init");
  } finally {
    loading.value = false;
  }
}

// Chiamata quando l'utente preme "START PARTITA"
function startGameplay() {
  isGameActive.value = true;
  startTimer();
}

async function handleMove(index) {
  if (!isGameActive.value) return; // Blocco interazione
  if (grid.value[index] !== 0) return;
  if (!isValidMove(lastPosition.value, index)) return;
  if (loading.value) return;

  grid.value[index] = currentNumber.value;
  lastPosition.value = index;
  currentNumber.value++;

  try {
    await api.post("/game/move", {
      gameId: gameId.value,
      position: index,
    });
  } catch (err) {
    console.error("Errore mossa:", err);
  }
}

async function undo() {
  if (!isGameActive.value) return;
  if (currentNumber.value <= 2 || undoCount.value <= 0) return;
  try {
    const res = await api.post("/game/undo", { gameId: gameId.value });
    const game = res.data.game;

    grid.value = game.grid;
    currentNumber.value = game.currentNumber;
    undoCount.value--;

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
  stopTimer();
  await initGame();
}

async function abandonGame() {
  if (!confirm("Vuoi abbandonare la partita? (Non verrà salvata)")) return;
  stopTimer();
  // Non salviamo nulla, usciamo e basta. Il backend pulirà alla prossima partita.
  router.push("/");
}

const validMoves = computed(() => {
  if (!isGameActive.value) return []; // Nessun suggerimento finché non parte
  const moves = [];
  for (let i = 0; i < 100; i++) {
    if (grid.value[i] === 0 && isValidMove(lastPosition.value, i)) {
      moves.push(i);
    }
  }
  return moves;
});

const isVictory = computed(() => currentNumber.value > 100);
const isGameOver = computed(
  () =>
    isGameActive.value && // Solo se attivo
    !isVictory.value &&
    validMoves.value.length === 0 &&
    lastPosition.value !== -1,
);

const hasCalledGameOver = ref(false);

watch(isGameOver, async (newValue) => {
  if (newValue && !hasCalledGameOver.value) {
    stopTimer();
    hasCalledGameOver.value = true;
    try {
      await api.post("/game/over", { gameId: gameId.value });
    } catch (e) {
      console.error(e);
    }
  } else if (!newValue) {
    hasCalledGameOver.value = false;
  }
});

watch(isVictory, (val) => {
  if (val) stopTimer();
});
</script>

<template>
  <div class="game-container">
    <div class="header">
      <div class="timer">⏱️ {{ elapsedTime }}</div>
    </div>

    <div class="controls">
      <button
        @click="undo"
        :disabled="
          !isGameActive ||
          currentNumber <= 2 ||
          undoCount <= 0 ||
          isVictory ||
          isGameOver
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
      <button @click="abandonGame" style="margin-left: 10px; background: #666">
        Abbandona 🏳️
      </button>
    </div>

    <div class="grid-wrapper">
      <Grid
        :grid="grid"
        :validMoves="validMoves"
        :currentPosition="lastPosition"
        @move="handleMove"
      />

      <!-- START OVERLAY (SOLO ALL'INIZIO) -->
      <div v-if="!isGameActive && !loading" class="overlay start-overlay">
        <h3>Pronto?</h3>
        <p>La posizione di partenza è casuale.</p>
        <button class="big-start-btn" @click="startGameplay">START ▶️</button>
      </div>
    </div>

    <!-- OVERLAYS -->
    <div v-if="isVictory" class="overlay victory">
      <h3>🏆 VITTORIA! 🏆</h3>
      <p>Hai completato il percorso in {{ elapsedTime }}!</p>
      <button @click="restartGame">Nuova Partita</button>
      <button
        @click="router.push('/leaderboard')"
        style="margin-top: 10px; background: #007bff"
      >
        Classifica
      </button>
    </div>

    <div v-if="isGameOver" class="overlay gameover">
      <h3>💀 GAME OVER 💀</h3>
      <p>Punteggio Finale: {{ currentNumber - 1 }}</p>
      <p>Tempo: {{ elapsedTime }}</p>
      <div class="overlay-controls">
        <button
          @click="restartGame"
          style="margin-left: 10px; background: #ff9800"
        >
          Ricomincia
        </button>
        <button
          @click="router.push('/leaderboard')"
          style="margin-left: 10px; background: #007bff"
        >
          Esci
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  text-align: center;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  font-family: monospace;
  font-size: 1.2rem;
}
.timer {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
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

.grid-wrapper {
  position: relative;
  display: block;
  max-width: 500px;
  margin: 0 auto;
}

.overlay {
  position: absolute; /* Ora è relativo alla griglia per lo Start */
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
  z-index: 10;
  border-radius: 8px; /* Match grid radius if any */
}
/* Victory/Gameover rimangono fixed full screen o relativi? Meglio Fixed per impatto */
.victory,
.gameover {
  position: fixed;
  z-index: 1000;
}

.start-overlay {
  background: rgba(255, 255, 255, 0.6); /* Semi-trasparente chiaro */
  backdrop-filter: blur(2px);
  color: #333;
}
.big-start-btn {
  font-size: 2rem;
  padding: 20px 40px;
  background: #28a745;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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
.overlay-controls {
  margin-top: 20px;
}
</style>
