<script setup>
import Grid from '../components/Grid.vue';
import { ref, computed } from 'vue'; // Importa computed
// STATO DEL GIOCO
const undoCount = ref(3);
const history = ref([]);
const grid = ref(Array(100).fill(0));
const currentNumber = ref(1); // Il numero che stiamo cercando di piazzare (inizia con 1)
const lastPosition = ref(-1); // Nessuna mossa precedente all'inizio
// --- HELPER LOGIC (Uguale al Backend!) ---
const toCoords = (index) => {
  return { x: index % 10, y: Math.floor(index / 10) };
};
const isValidMove = (currentIndex, targetIndex) => {
  // Se è la prima mossa (1), è sempre valida
  if (currentIndex === -1) return true;
  const start = toCoords(currentIndex);
  const end = toCoords(targetIndex);
  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const isCardinal = (dx === 3 && dy === 0) || (dx === 0 && dy === 3);
  const isDiagonal = (dx === 2 && dy === 2);
  return isCardinal || isDiagonal;
};
// --- HANDLER ---
function handleMove(index) {
  // 1. La cella è occupata?
  if (grid.value[index] !== 0) {
    alert("Cella occupata!");
    return;
  }
  // 2. La mossa è valida?
  if (!isValidMove(lastPosition.value, index)) {
    alert("Mossa non valida!");
    return;
  }
  history.value.push(lastPosition.value);
  // 3. APPLICA MOSSA (Optimistic UI)
  grid.value[index] = currentNumber.value;
  lastPosition.value = index;
  currentNumber.value++;
  
  // TODO: Inviare anche al backend!
}

// Nuova funzione Undo


function undo() {
  if (currentNumber.value <= 1) return; // Niente da annullare
  // 1. Pulisci cella corrente
  // lastPosition è dove siamo ORA. Dobbiamo pulirla.
  if (undoCount.value <= 0) { // <-- CONTROLLO
    alert("Hai finito gli Undo disponibili!");
    return;
  }
  grid.value[lastPosition.value] = 0;
  // 2. Torna indietro
  currentNumber.value--;
  
  // 3. Recupera la posizione precedente dalla storia
  const prev = history.value.pop();
  lastPosition.value = prev;
  undoCount.value--; // Scala una "vita"
}

// CALCOLO MOSSE VALIDE
const validMoves = computed(() => {
  const moves = [];
  // Controlliamo tutte le 100 celle
  for (let i = 0; i < 100; i++) {
    // Deve essere vuota E valida secondo le regole
    if (grid.value[i] === 0 && isValidMove(lastPosition.value, i)) {
      moves.push(i);
    }
  }
  return moves;
});
</script>
<template>
  <div class="game-container">
    <h2>Turno: {{ currentNumber }}</h2>
    
    <div class="controls">
      <button @click="undo" :disabled="currentNumber <= 1 || undoCount <= 0">
        Undo ↩️ ({{ undoCount }})
      </button>
    </div>
    <Grid :grid="grid" :validMoves="validMoves" @move="handleMove" />
  </div>
</template>
<style scoped>
.game-container { text-align: center; }
.controls { margin-bottom: 20px; }
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
</style>