<template>
  <div class="game-board">
    <!-- Loop to create 100 cells -->
    <!-- cellIndex ranges from 0 to 99 -->
    <div
      v-for="(cell, index) in grid"
      :key="index"
      class="cell"
      :class="{
        valid: showHints && isValid(index),
        current: index === currentPosition,
        ranked: props.gameMode === 'ranked',
        clicked: clickedCell === index,
        invalid: invalidCell === index,
      }"
      @click="onCellClick(index)"
    >
      <!-- Show the number if present, otherwise nothing -->
      {{ cell !== 0 ? cell : "" }}
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";

const props = defineProps([
  "grid",
  "validMoves",
  "currentPosition",
  "gameMode",
]);
const emit = defineEmits(["move"]);

// Tutorial shows hints, Ranked hides them
const showHints = computed(() => props.gameMode !== "ranked");

// Animation state
const clickedCell = ref(null);
const invalidCell = ref(null);

function onCellClick(index) {
  // Check if this is a valid move
  const isValidMove = isValid(index);

  if (isValidMove) {
    // Valid move - pulse animation
    clickedCell.value = index;
    setTimeout(() => {
      clickedCell.value = null;
    }, 300);
  } else {
    // Invalid move - red flash
    invalidCell.value = index;
    setTimeout(() => {
      invalidCell.value = null;
    }, 400);
  }

  emit("move", index);
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
  width: 100%;
  margin: 20px auto;
  background: #ccc;
  padding: 4px;
}
.cell {
  aspect-ratio: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

/* RANKED MODE: Larger numbers */
.cell.ranked {
  font-size: 1.5rem;
  font-weight: 700;
}

.cell:hover {
  background: #e6f7ff;
}

.valid {
  background-color: #d4edda;
  border: 2px solid #28a745;
  cursor: pointer;
}

.valid:hover {
  background-color: #c3e6cb;
}

.current {
  background-color: #007bff !important;
  color: white;
  border: 2px solid #0056b3;
}

/* CLICK ANIMATION (valid move) */
.cell.clicked {
  animation: clickPulse 0.3s ease;
}

@keyframes clickPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* INVALID MOVE ANIMATION */
.cell.invalid {
  animation: invalidShake 0.4s ease;
  background: #ff4444 !important;
  color: white;
}

@keyframes invalidShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 600px) {
  .game-board {
    max-width: 100%;
    width: 96%; /* Leave space on sides */
    gap: 2px;
    padding: 2px;
    margin: 20px auto 10px auto; /* Center with auto margins */
  }

  .cell {
    font-size: 0.9rem;
    border-radius: 2px;
  }

  .cell.ranked {
    font-size: 1.1rem;
  }
}

/* Tablet adjustments */
@media (min-width: 601px) and (max-width: 900px) {
  .game-board {
    max-width: 400px;
  }

  .cell {
    font-size: 1rem;
  }

  .cell.ranked {
    font-size: 1.3rem;
  }
}
</style>
