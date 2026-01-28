<script setup>
import { X } from "lucide-vue-next";
import { useNotification } from "../composables/useNotification";

const { notifications, removeNotification } = useNotification();
</script>

<template>
  <div class="notification-container" aria-live="polite" aria-atomic="false">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-${notification.type}`"
        role="alert"
        :aria-label="`${notification.type} notification: ${notification.message}`"
      >
        <span class="notification-message">{{ notification.message }}</span>
        <button
          class="notification-close"
          @click="removeNotification(notification.id)"
          :aria-label="`Close ${notification.type} notification`"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

.notification-message {
  flex: 1;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
  opacity: 0.7;
}

.notification-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.notification-success {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  color: white;
}

.notification-error {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.notification-warning {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #212529;
}

.notification-info {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  color: white;
}

/* Animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1100px) {
  .notification-container {
    top: 70px;
    right: 10px;
    left: 10px;
    align-items: stretch;
  }

  .notification {
    min-width: unset;
    max-width: unset;
    width: 100%;
  }
}
</style>
