<template>
  <div class="game-board">
    <!-- Loop per creare 100 celle -->
    <!-- cellIndex va da 0 a 99 -->
    <div
      v-for="(cell, index) in grid"
      :key="index"
      class="cell"
      :class="{ valid: isValid(index), current: index === currentPosition }"
      @click="onCellClick(index)"
    >
      <!-- Mostra il numero se presente, altrimenti niente -->
      {{ cell !== 0 ? cell : "" }}
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
// Definiamo una prop per ricevere la griglia dal genitore (Game.vue)
const props = defineProps(["grid", "validMoves", "currentPosition"]);
const emit = defineEmits(["move"]);
// Per ora usiamo una griglia di test se non passata
const debugGrid = ref(Array(100).fill(0));
function onCellClick(index) {
  emit("move", index); // Diciamo al genitore: "Hanno cliccato la cella X"
}
function isValid(index) {
  return props.validMoves && props.validMoves.includes(index);
}
</script>
<style scoped>
.game-board {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* IL MAGICO CSS GRID */
  gap: 4px;
  max-width: 500px;
  margin: 20px auto;
  background: #ccc;
  padding: 4px;
}
.cell {
  aspect-ratio: 1; /* Mantiene la cella quadrata */
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}
.cell:hover {
  background: #e6f7ff;
}

.valid {
  background-color: #d4edda; /* Verde chiaro */
  border: 2px solid #28a745;
  cursor: pointer;
}
.valid:hover {
  background-color: #c3e6cb;
}

.current {
  background-color: #007bff !important; /* Blu */
  color: white;
  border: 2px solid #0056b3;
}
</style>
