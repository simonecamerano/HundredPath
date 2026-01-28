<script setup>
import { ArrowRight, ChevronRight, Move, Target, X } from "lucide-vue-next";
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "complete", "skip"]);

const currentStep = ref(0);
const totalSteps = 4;

const steps = [
  {
    title: "Welcome to HundredPath!",
    description:
      "The goal is simple: place the numbers from 1 to 100 on the grid as fast as you can.",
    icon: Target,
    animation: "welcome",
  },
  {
    title: "Straight Move",
    description:
      "You can jump 2 cells horizontally or vertically from your current position.",
    icon: Move,
    animation: "straight",
  },
  {
    title: "Diagonal Move",
    description:
      "Or you can jump 1 cell diagonally (in any direction).",
    icon: Move,
    animation: "diagonal",
  },
  {
    title: "Green Cells",
    description:
      "The green highlighted cells are valid moves. Click one to place the next number!",
    icon: ChevronRight,
    animation: "hints",
  },
];

const currentStepData = computed(() => steps[currentStep.value]);
const isLastStep = computed(() => currentStep.value === totalSteps - 1);
const progress = computed(() => ((currentStep.value + 1) / totalSteps) * 100);

function nextStep() {
  if (isLastStep.value) {
    completeTutorial();
  } else {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function skipTutorial() {
  localStorage.setItem("tutorialSeen", "true");
  emit("skip");
  emit("update:modelValue", false);
}

function completeTutorial() {
  localStorage.setItem("tutorialSeen", "true");
  emit("complete");
  emit("update:modelValue", false);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="tutorial-overlay">
      <div class="tutorial-backdrop" @click="skipTutorial"></div>

      <div class="tutorial-modal">
        <!-- Progress bar -->
        <div class="tutorial-progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>

        <!-- Skip button -->
        <button
          class="skip-btn"
          @click="skipTutorial"
          aria-label="Skip tutorial"
        >
          <X :size="20" />
        </button>

        <!-- Step content -->
        <div class="tutorial-content">
          <!-- Icon -->
          <div class="step-icon" :class="currentStepData.animation">
            <component :is="currentStepData.icon" :size="48" />
          </div>

          <!-- Title -->
          <h2 class="step-title">{{ currentStepData.title }}</h2>

          <!-- Description -->
          <p class="step-description">{{ currentStepData.description }}</p>

          <!-- Animation Demo -->
          <div class="demo-container">
            <!-- Step 0: Welcome animation -->
            <div v-if="currentStep === 0" class="demo-welcome" style="display: flex; flex-direction: row; gap: 8px; justify-content: center; align-items: center; margin: 16px 0 0 0;">
              <div class="demo-cell start">1</div>
              <div class="demo-cell">→</div>
              <div class="demo-cell">...</div>
              <div class="demo-cell">→</div>
              <div class="demo-cell end">100</div>
            </div>

            <!-- Step 1: Straight movement -->
            <div v-if="currentStep === 1" class="demo-grid demo-straight">
              <!-- Griglia 7x7 con 1 al centro e 2 a distanza di 2 caselle -->
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell valid pulse">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell current">1</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid pulse">2</div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              </div>
            </div>

            <!-- Step 2: Diagonal movement -->
            <div v-if="currentStep === 2" class="demo-grid demo-diagonal">
              <!-- Griglia 7x7 con 1 al centro e frecce diagonali a distanza di 2 (posizioni corrette) -->
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell current">1</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid pulse">2</div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
            </div>

            <!-- Step 3: Green hints -->
            <div v-if="currentStep === 3" class="demo-grid demo-hints">
              <!-- Griglia 7x7: 2 solo sulla terza dritto e seconda diagonale dal centro (4,4) -->
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell current">1</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div>
              <div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell valid glow">2</div><div class="demo-cell"></div><div class="demo-cell"></div><div class="demo-cell"></div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="tutorial-nav">
          <button
            v-if="currentStep > 0"
            class="nav-btn btn-back"
            @click="prevStep"
          >
            Back
          </button>
          <div v-else class="nav-spacer"></div>

          <!-- Step indicators -->
          <div class="step-indicators">
            <span
              v-for="i in totalSteps"
              :key="i"
              class="indicator"
              :class="{ active: i - 1 <= currentStep }"
            ></span>
          </div>

          <button class="nav-btn btn-next" @click="nextStep">
            {{ isLastStep ? "Start!" : "Next" }}
            <ArrowRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.tutorial-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.tutorial-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.tutorial-modal {
  position: relative;
  background: white;
  border-radius: 24px;
  max-width: 480px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Progress bar */
.tutorial-progress {
  height: 4px;
  background: #e5e7eb;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #ec4899);
  transition: width 0.3s ease;
}

/* Skip button */
.skip-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
}

.skip-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Content */
.tutorial-content {
  padding: 40px 32px 24px;
  text-align: center;
}

.step-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: iconBounce 0.5s ease-out;
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.step-description {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Demo grids */
.demo-container {
  margin: 0 auto;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.demo-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 12px;
}

.demo-welcome {
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.demo-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

/* Griglia demo 7x7 quadrata e compatta */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  gap: 2px;
  margin: 16px auto 0 auto;
  width: 320px;
  height: 320px;
  align-items: center;
  justify-content: center;
}
.demo-row {
  display: contents;
}

.demo-cell.current {
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  color: white;
  font-weight: 700;
}

.demo-cell.valid {
  background: #d1fae5;
  color: #059669;
  border-color: #10b981;
}

.demo-cell.skip {
  background: #fef3c7;
  color: #d97706;
  font-size: 1.5rem;
}

.demo-cell.start {
  background: #ddd6fe;
  color: #7c3aed;
}

.demo-cell {
  width: 40px;
  height: 40px;
  aspect-ratio: 1 / 1;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: #9ca3af;
  border: 2px solid transparent;
  box-sizing: border-box;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}

/* Navigation */
.tutorial-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 24px;
  gap: 16px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back {
  background: #f3f4f6;
  border: none;
  color: #6b7280;
}

.btn-back:hover {
  background: #e5e7eb;
}

.btn-next {
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  border: none;
  color: white;
}

.btn-next:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
}

.nav-spacer {
  width: 100px;
}

/* Step indicators */
.step-indicators {
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: all 0.3s;
}

.indicator.active {
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  width: 24px;
  border-radius: 4px;
}

/* Mobile */
@media (max-width: 480px) {
  .tutorial-modal {
    border-radius: 16px;
  }

  .tutorial-content {
    padding: 32px 20px 16px;
  }

  .step-title {
    font-size: 1.25rem;
  }

  .step-description {
    font-size: 0.9rem;
  }

  .demo-cell {
    width: 36px;
    height: 36px;
    font-size: 0.875rem;
  }

  .nav-btn {
    padding: 10px 16px;
    font-size: 0.875rem;
  }
}
</style>
