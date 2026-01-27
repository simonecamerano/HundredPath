<script setup>
import {
  LogOut,
  Play,
  RotateCcw,
  Skull,
  Target,
  Timer,
  Trophy,
  Undo,
  User,
  UserPlus,
} from "lucide-vue-next";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Grid from "../components/Grid.vue";
import { useConfirm } from "../composables/useConfirm";
import { useNotification } from "../composables/useNotification";
import api from "../services/api";
import { useAuthStore } from "../stores/auth"; // Import auth store

const router = useRouter();
const authStore = useAuthStore(); // Accesso allo stato auth
const { error: notifyError } = useNotification();
const { confirm } = useConfirm();

// GAME MODE (from route query)
const gameMode = ref("tutorial"); // 'tutorial' or 'ranked'

// STATE
const grid = ref(Array(100).fill(0));
const currentNumber = ref(1);
const lastPosition = ref(-1);
const gameId = ref(null);
const undoCount = ref(3);
const loading = ref(false);
const isGameActive = ref(false); // Has the game started (timer active)?

const localHistory = ref([]); // For undo in guest mode

// TIMER
const startTime = ref(null);
const elapsedTime = ref("00:00.00");
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
    const totalMs = Date.now() - startTime.value;
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const centis = Math.floor((totalMs % 1000) / 10);

    if (minutes > 0) {
      elapsedTime.value = `${minutes}m ${seconds
        .toString()
        .padStart(2, "0")}.${centis.toString().padStart(2, "0")}s`;
    } else {
      elapsedTime.value = `${seconds.toString().padStart(2, "0")}.${centis
        .toString()
        .padStart(2, "0")}s`;
    }
  }, 50);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

onMounted(async () => {
  // Read mode from query params (default: tutorial)
  const queryMode = router.currentRoute.value.query.mode;
  if (queryMode === "ranked") {
    gameMode.value = "ranked";
  } else {
    gameMode.value = "tutorial";
  }

  // Load data, but DO NOT start the game yet
  await initGame();
});

onUnmounted(() => {
  stopTimer();
});

async function initGame() {
  try {
    loading.value = true;

    // RESET COMMON STATE
    undoCount.value = 3;
    isGameActive.value = false;
    elapsedTime.value = "00.00s"; // Reset display
    currentNumber.value = 1; // Safety reset

    if (authStore.isAuthenticated) {
      // --- LOGGED USER LOGIC ---
      console.log("🎮 Starting game with mode:", gameMode.value);
      const res = await api.post("/game/start", { gameMode: gameMode.value });

      const game = res.data.game;
      console.log("✅ Game created with mode:", game.gameMode, "ID:", game._id);
      gameId.value = game._id;
      grid.value = game.grid;
      currentNumber.value = game.currentNumber;

      const startPos = game.grid.findIndex((n) => n === 1);
      lastPosition.value = startPos;
    } else {
      // --- GUEST LOGIC (CLIENT ONLY) ---
      grid.value = Array(100).fill(0);
      localHistory.value = [];

      // Random start
      const startPos = Math.floor(Math.random() * 100);
      grid.value[startPos] = 1;
      lastPosition.value = startPos;
      currentNumber.value = 2; // Ready for 2
    }
  } catch (err) {
    console.error("Error starting game:", err);
    notifyError("Error initializing game");
  } finally {
    loading.value = false;
  }
}

// Called when user presses "START" button
function startGameplay() {
  isGameActive.value = true;
  startTimer();
}

async function handleMove(index) {
  if (!isGameActive.value) return; // Blocco interazione
  if (grid.value[index] !== 0) return;
  if (!isValidMove(lastPosition.value, index)) return;
  if (loading.value) return;

  // AGGIORNAMENTO OTTIMISTICO / LOCALE
  grid.value[index] = currentNumber.value;

  if (!authStore.isAuthenticated) {
    // Save history for local undo
    localHistory.value.push({
      position: index,
      number: currentNumber.value,
    });
  }

  const newPos = index;
  lastPosition.value = newPos;
  currentNumber.value++;

  if (authStore.isAuthenticated) {
    // --- SERVER SYNC ---
    try {
      await api.post("/game/move", {
        gameId: gameId.value,
        position: index,
      });
    } catch (err) {
      console.error("Move error:", err);
      // In case of error we should revert, for now we just log
    }
  }
}

async function undo() {
  if (!isGameActive.value) return;
  if (currentNumber.value <= 2 || undoCount.value <= 0) return;

  if (authStore.isAuthenticated) {
    // --- SERVER UNDO ---
    try {
      const res = await api.post("/game/undo", { gameId: gameId.value });
      const game = res.data.game;

      grid.value = game.grid;
      currentNumber.value = game.currentNumber;
      undoCount.value--;

      if (game.moves.length > 0) {
        lastPosition.value = game.moves[game.moves.length - 1].position;
      } else {
        lastPosition.value = -1; // Should not happen if check > 2
      }
    } catch (err) {
      console.error("Undo error:", err);
    }
  } else {
    // --- LOCAL UNDO ---
    const lastMove = localHistory.value.pop();
    if (lastMove) {
      grid.value[lastMove.position] = 0;
      currentNumber.value--;
      undoCount.value--;

      // Recalculate lastPosition
      if (localHistory.value.length > 0) {
        lastPosition.value =
          localHistory.value[localHistory.value.length - 1].position;
      } else {
        // If we removed everything, we need to find the 1 (which is not in history)
        lastPosition.value = grid.value.findIndex((n) => n === 1);
      }
    }
  }
}

async function restartGame() {
  stopTimer();
  await initGame();
}

async function abandonGame() {
  const confirmed = await confirm("Do you want to abandon the game?");
  if (!confirmed) return;
  stopTimer();

  if (authStore.isAuthenticated && gameId.value) {
    try {
      if (gameMode.value === "tutorial") {
        // Tutorial abandoned → save as completed (unlocks ranked)
        console.log(
          "🏳️ Abandoning TUTORIAL, calling /game/over to unlock ranked",
        );
        const response = await api.post("/game/over", { gameId: gameId.value });
        console.log("📝 Tutorial abandon response:", response.data);
      } else {
        // Ranked abandoned → delete game (shouldn't count)
        console.log("🏳️ Abandoning RANKED, deleting game (won't count)");
        await api.delete(`/game/${gameId.value}`);
        console.log("✅ Ranked game deleted");
      }
    } catch (e) {
      console.error("❌ Error on abandon:", e);
    }
  }

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
    isGameActive.value && // Only if active
    !isVictory.value &&
    validMoves.value.length === 0 &&
    lastPosition.value !== -1,
);

const hasCalledGameOver = ref(false);

watch(isGameOver, async (newValue) => {
  if (newValue && !hasCalledGameOver.value) {
    stopTimer();
    hasCalledGameOver.value = true;

    if (authStore.isAuthenticated) {
      try {
        console.log("🏁 Calling /game/over for gameId:", gameId.value);
        const response = await api.post("/game/over", { gameId: gameId.value });
        console.log("📝 Game over response:", response.data);

        // If tutorial completed, force home refresh
        if (response.data.tutorialCompleted) {
          console.log("🎓 Tutorial completed! Ranked should unlock now.");
          authStore.setTutorialCompleted(true);
        }
      } catch (e) {
        console.error("❌ Error calling game/over:", e);
      }
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
    <div class="game-header">
      <div class="stat-card timer-card">
        <Timer :size="20" class="stat-icon" />
        <span class="stat-value">{{ elapsedTime }}</span>
      </div>
      <div class="stat-card score-card">
        <Target :size="20" class="stat-icon" />
        <span class="stat-value">{{ currentNumber - 1 }}/100</span>
      </div>
      <div v-if="!authStore.isAuthenticated" class="badge badge-purple">
        <User :size="14" />
        Ospite
      </div>
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
        class="btn btn-outline btn-sm"
      >
        <Undo :size="16" />
        Undo ({{ undoCount }})
      </button>
      <button @click="restartGame" class="btn btn-secondary btn-sm">
        <RotateCcw :size="16" />
        Restart
      </button>
      <button @click="abandonGame" class="btn btn-outline btn-sm">
        <LogOut :size="16" />
        Abandon
      </button>
    </div>

    <div class="grid-wrapper">
      <Grid
        :grid="grid"
        :validMoves="validMoves"
        :currentPosition="lastPosition"
        :gameMode="gameMode"
        @move="handleMove"
      />

      <!-- START OVERLAY -->
      <div v-if="!isGameActive && !loading" class="overlay start-overlay">
        <div class="overlay-content">
          <h2 class="text-gradient-full">
            Pronto{{
              authStore.user?.username ? ", " + authStore.user.username : ""
            }}?
          </h2>
          <p class="overlay-subtitle">La posizione di partenza è casuale.</p>
          <button class="btn btn-gradient btn-lg" @click="startGameplay">
            <Play :size="20" />
            START
          </button>
        </div>
      </div>
    </div>

    <!-- VICTORY OVERLAY -->
    <div v-if="isVictory" class="overlay victory-overlay">
      <div class="overlay-content">
        <Trophy :size="64" class="overlay-icon trophy-icon" />
        <h2 class="text-gradient-full">VICTORY!</h2>
        <p class="overlay-stats">
          Completed in <strong>{{ elapsedTime }}</strong>
        </p>

        <div v-if="!authStore.isAuthenticated" class="guest-cta">
          <p>Register to save your record on the leaderboard!</p>
          <button @click="router.push('/register')" class="btn btn-gradient">
            <UserPlus :size="18" />
            Register Now
          </button>
        </div>

        <div class="overlay-actions">
          <button @click="restartGame" class="btn btn-secondary">
            <RotateCcw :size="18" />
            New Game
          </button>
          <button @click="router.push('/leaderboard')" class="btn btn-primary">
            <Trophy :size="18" />
            Leaderboard
          </button>
        </div>
      </div>
    </div>

    <!-- GAME OVER OVERLAY -->
    <div v-if="isGameOver" class="overlay gameover-overlay">
      <div class="overlay-content">
        <Skull :size="64" class="overlay-icon gameover-icon" />
        <h2 class="text-gradient-full">GAME OVER</h2>
        <div class="overlay-stats">
          <p>
            Final Score: <strong>{{ currentNumber - 1 }}</strong>
          </p>
          <p>
            Time: <strong>{{ elapsedTime }}</strong>
          </p>
        </div>

        <div v-if="!authStore.isAuthenticated" class="guest-cta">
          <p>Don't give up! Register to climb the leaderboard.</p>
          <button @click="router.push('/register')" class="btn btn-gradient">
            <UserPlus :size="18" />
            Create Account
          </button>
        </div>

        <div class="overlay-actions">
          <button @click="restartGame" class="btn btn-secondary">
            <RotateCcw :size="18" />
            Restart
          </button>
          <button @click="router.push('/leaderboard')" class="btn btn-primary">
            <LogOut :size="18" />
            Exit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
}

/* GAME HEADER - Stats Cards */
.game-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

.stat-card {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: white;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.timer-card {
  border: 2px solid rgba(32, 201, 151, 0.3);
  box-shadow: var(--shadow-glow-teal);
}

.score-card {
  border: 2px solid rgba(121, 80, 242, 0.3);
  box-shadow: var(--shadow-glow-purple);
}

.stat-icon {
  color: var(--color-teal);
}

.score-card .stat-icon {
  color: var(--color-purple);
}

.stat-value {
  color: var(--color-gray-800);
  font-family: 'Courier New', monospace;
}

/* CONTROLS */
.controls {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
}

/* GRID WRAPPER */
.grid-wrapper {
  position: relative;
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

/* OVERLAYS */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: var(--radius-xl);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.overlay-content {
  text-align: center;
  padding: var(--space-xl);
  max-width: 90%;
}

/* START OVERLAY */
.start-overlay {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: inset 0 0 50px rgba(121, 80, 242, 0.1);
}

.start-overlay h2 {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
  font-weight: 800;
}

.overlay-subtitle {
  font-size: 1.1rem;
  color: var(--color-gray-600);
  margin-bottom: var(--space-xl);
}

/* VICTORY & GAMEOVER OVERLAYS */
.victory-overlay,
.gameover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.victory-overlay .overlay-content,
.gameover-overlay .overlay-content {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  animation: slideUp 0.4s ease-out;
}

.overlay-icon {
  margin-bottom: var(--space-lg);
  animation: iconPop 0.5s ease-out;
}

.trophy-icon {
  color: #ffd700;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
}

.gameover-icon {
  color: var(--color-error);
  filter: drop-shadow(0 0 20px rgba(255, 107, 107, 0.5));
}

.victory-overlay h2,
.gameover-overlay h2 {
  font-size: 2.5rem;
  margin-bottom: var(--space-lg);
  font-weight: 800;
}

.overlay-stats {
  font-size: 1.1rem;
  color: var(--color-gray-700);
  margin-bottom: var(--space-xl);
  line-height: 1.8;
}

.overlay-stats strong {
  color: var(--color-purple);
  font-weight: 700;
}

.overlay-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.overlay-actions .btn {
  min-width: 160px;
}

/* GUEST CTA */
.guest-cta {
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.1),
    rgba(214, 51, 132, 0.1)
  );
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  border: 2px solid rgba(121, 80, 242, 0.2);
}

.guest-cta p {
  color: var(--color-gray-700);
  margin-bottom: var(--space-md);
  font-weight: 600;
}

/* ANIMATIONS */
@keyframes iconPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* MOBILE RESPONSIVE */
@media (max-width: 768px) {
  .game-container {
    padding: var(--space-lg) var(--space-md);
  }

  .game-header {
    gap: var(--space-sm);
  }

  .stat-card {
    font-size: 1rem;
    padding: 10px 16px;
  }

  .controls {
    gap: var(--space-sm);
  }

  .controls .btn {
    width: 100%;
    max-width: 300px;
  }

  .start-overlay h2 {
    font-size: 2rem;
  }

  .victory-overlay h2,
  .gameover-overlay h2 {
    font-size: 2rem;
  }

  .overlay-actions {
    flex-direction: column;
  }

  .overlay-actions .btn {
    width: 100%;
  }

  .victory-overlay .overlay-content,
  .gameover-overlay .overlay-content {
    padding: var(--space-xl);
    max-width: 90%;
  }
}
</style>
