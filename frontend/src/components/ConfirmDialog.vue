<script setup>
import { useConfirm } from "../composables/useConfirm";

const { state } = useConfirm();
</script>

<template>
  <transition name="modal">
    <div v-if="state.isOpen" class="modal-overlay" @click="state.onCancel">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirm</h3>
        </div>
        <div class="modal-body">
          <p>{{ state.message }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="state.onCancel">Cancel</button>
          <button class="btn-confirm" @click="state.onConfirm">Confirm</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.modal-body {
  padding: 24px;
}

.modal-body p {
  margin: 0;
  font-size: 1rem;
  color: #495057;
  line-height: 1.6;
}

.modal-footer {
  padding: 16px 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background-color: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background-color: #dee2e6;
}

.btn-confirm {
  background: linear-gradient(135deg, #7950f2 0%, #d63384 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(121, 80, 242, 0.4);
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 90%;
  }
}
</style>
