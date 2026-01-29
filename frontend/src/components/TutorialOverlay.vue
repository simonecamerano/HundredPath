<script setup>
import {
  ArrowRight,
  ChevronRight,
  EyeOff,
  Move,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  X,
} from "lucide-vue-next";
import { computed, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  steps: {
    type: Array,
    default: () => [],
  },
  tutorialType: {
    type: String,
    default: "basic", // 'basic', 'ranked', 'mastermind'
  },
});

const emit = defineEmits(["update:modelValue", "complete", "skip"]);

const currentStep = ref(0);

// Basic Steps (Tutorial Mode)
const basicSteps = [
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
    description: "Or you can jump 1 cell diagonally (in any direction).",
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
  {
    title: "Made a Mistake?",
    description:
      "Don't worry! You can use the Undo button to go back one step. But be careful, you only have limited undos!",
    icon: RotateCcw,
    animation: "undo",
  },
];

// Ranked Steps
const rankedSteps = [
  {
    title: "Ranked Mode",
    description:
      "Compete against other players for the top spot on the leaderboard!",
    icon: Target,
    animation: "ranked_intro",
  },
  {
    title: "Scoring",
    description:
      "Your score relies on reaching high numbers and your speed. Be fast and precise!",
    icon: Target, // Can change icon
    animation: "ranked_scoring",
  },
  {
    title: "No Hints",
    description:
      "Green cell indicators are disabled in Ranked mode. You're on your own!",
    icon: EyeOff,
    animation: "ranked_warning",
  },
];

// Mastermind Steps
const mastermindSteps = [
  {
    title: "Mastermind Mode",
    description:
      "The rules of movement are the same, but the scoring changes completely!",
    icon: Target,
    animation: "mastermind_intro",
  },
  {
    title: "Bonus Points",
    description:
      "Place ODD numbers on DARK cells and EVEN numbers on LIGHT cells to earn +1 Bonus Point per move.",
    icon: Target,
    animation: "mastermind_bonus",
  },
  {
    title: "Maximize Score",
    description:
      "The leaderboard is based on Total Score (Number reached + Bonus Points). Plan your path!",
    icon: Move,
    animation: "mastermind_strategy",
  },
];

const currentSteps = computed(() => {
  if (props.steps && props.steps.length > 0) return props.steps;
  if (props.tutorialType === "ranked") return rankedSteps;
  if (props.tutorialType === "mastermind") return mastermindSteps;
  return basicSteps;
});

const totalSteps = computed(() => currentSteps.value.length);
const currentStepData = computed(
  () => currentSteps.value[currentStep.value] || {},
);

const isLastStep = computed(() => currentStep.value === totalSteps.value - 1);
const progress = computed(
  () => ((currentStep.value + 1) / totalSteps.value) * 100,
);

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      currentStep.value = 0;
    }
  },
);

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
            <!-- Step 0: Welcome animation (Basic & Ranked Intro) -->
            <div
              v-if="
                currentStep === 0 &&
                (tutorialType === 'basic' || tutorialType === 'ranked')
              "
              class="demo-welcome"
              style="
                display: flex;
                flex-direction: row;
                gap: 8px;
                justify-content: center;
                align-items: center;
                margin: 16px 0 0 0;
              "
            >
              <div class="demo-cell start">1</div>
              <div class="demo-cell">→</div>
              <div class="demo-cell">...</div>
              <div class="demo-cell">→</div>
              <div class="demo-cell end">100</div>
            </div>

            <!-- Step 1: Straight movement (Basic Only) -->
            <div
              v-if="currentStep === 1 && tutorialType === 'basic'"
              class="demo-grid demo-straight"
            >
              <!-- Griglia 7x7 con 1 al centro e 2 a distanza di 2 caselle -->

              <!-- Griglia 7x7 con 1 al centro e 2 a distanza di 2 caselle -->
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell valid pulse">2</div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell valid pulse">2</div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell current">1</div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell valid pulse">2</div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
              <div class="demo-row">
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell valid pulse">2</div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
                <div class="demo-cell"></div>
              </div>
            </div>

            <!-- Step 2: Diagonal movement (Basic Only) -->
            <div
              v-if="currentStep === 2 && tutorialType === 'basic'"
              class="demo-grid demo-diagonal"
            >
              <!-- Griglia 7x7 con 1 al centro e frecce diagonali a distanza di 2 (posizioni corrette) -->
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid pulse">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid pulse">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell current">1</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid pulse">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid pulse">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
            </div>

            <!-- Step 3: Green hints (Basic Only) -->
            <div
              v-if="currentStep === 3 && tutorialType === 'basic'"
              class="demo-grid demo-hints"
            >
              <!-- Griglia 7x7: 2 solo sulla terza dritto e seconda diagonale dal centro (4,4) -->
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell current">1</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell valid glow">2</div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
              <div class="demo-cell"></div>
            </div>
            <!-- Step 4: Undo demo (Basic Only) -->
            <div
              v-if="currentStep === 4 && tutorialType === 'basic'"
              class="demo-welcome"
              style="
                display: flex;
                flex-direction: row;
                gap: 8px;
                justify-content: center;
                align-items: center;
                margin: 16px 0 0 0;
              "
            >
              <div class="demo-cell start">2</div>
              <div class="demo-cell">→</div>
              <div class="demo-cell" style="position: relative">
                <div
                  style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ef4444;
                    font-size: 24px;
                    font-weight: bold;
                    animation: fadeOut 1s infinite alternate;
                  "
                >
                  <RotateCcw :size="24" />
                </div>
                <span style="opacity: 0.3">3</span>
              </div>
              <div class="demo-cell">→</div>
              <div class="demo-cell start">2</div>
            </div>

            <!-- RANKED DEMOS -->

            <!-- Ranked Step 1: Scoring -->
            <div
              v-if="currentStep === 1 && tutorialType === 'ranked'"
              class="demo-welcome"
              style="
                display: flex;
                gap: 12px;
                justify-content: center;
                align-items: center;
                margin-top: 20px;
                font-size: 1.5rem;
                font-weight: bold;
              "
            >
              <div class="demo-cell end">100</div>
              <div>+</div>
              <div class="demo-cell"><Timer :size="28" /></div>
              <div>=</div>
              <div class="demo-cell valid glow"><Trophy :size="28" /></div>
            </div>

            <!-- Ranked Step 2: No Hints -->
            <div
              v-if="currentStep === 2 && tutorialType === 'ranked'"
              style="display: flex; flex-direction: column; align-items: center"
            >
              <div class="demo-grid demo-hints">
                <!-- Row 1 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>
                <!-- Row 2 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>
                <!-- Row 3 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>

                <!-- Active Row 4 -->
                <div class="demo-row">
                  <!-- Target 2 (Left) -->
                  <div
                    class="demo-cell"
                    style="
                      background: transparent;
                      border: 2px dashed #9ca3af;
                      color: #9ca3af;
                      font-weight: bold;
                    "
                  >
                    2
                  </div>

                  <!-- Skipped Cells -->
                  <div
                    class="demo-cell"
                    style="background: #e5e7eb; border: 1px solid #d1d5db"
                  ></div>
                  <div
                    class="demo-cell"
                    style="background: #e5e7eb; border: 1px solid #d1d5db"
                  ></div>

                  <!-- Current 1 -->
                  <div class="demo-cell current">1</div>

                  <!-- Skipped Cells -->
                  <div
                    class="demo-cell"
                    style="background: #e5e7eb; border: 1px solid #d1d5db"
                  ></div>
                  <div
                    class="demo-cell"
                    style="background: #e5e7eb; border: 1px solid #d1d5db"
                  ></div>

                  <!-- Target 2 (Right) -->
                  <div
                    class="demo-cell"
                    style="
                      background: transparent;
                      border: 2px dashed #9ca3af;
                      color: #9ca3af;
                      font-weight: bold;
                    "
                  >
                    2
                  </div>
                </div>

                <!-- Row 5 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>
                <!-- Row 6 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>
                <!-- Row 7 -->
                <div class="demo-row">
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                  <div class="demo-cell"></div>
                </div>
              </div>

              <!-- Banner Below -->
              <div style="margin-top: 16px">
                <div
                  style="
                    background: #ef4444;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: bold;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                  "
                >
                  <EyeOff :size="20" /> No Hints
                </div>
              </div>
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
