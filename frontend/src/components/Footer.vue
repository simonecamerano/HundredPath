<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-text">
        © {{ currentYear }} HundredPath - Il Gioco Logico 10x10
      </p>
      <p class="footer-links">
        <span>Made with ❤️ by Simone Camerano</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  margin-top: 80px;
  padding: 15px 20px; /* Ridotto: prima era 30px */
  background-color: hsla(250, 100%, 98%, 1);
   box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-text {
  color: #6c757d;
  font-size: 0.85rem;
  margin-bottom: 5px;
}

.footer-links {
  color: #adb5bd;
  font-size: 0.8rem;
  margin: 0;
}

.footer-links span {
  display: inline-block;
}

@media (max-width: 600px) {
  .app-footer {
    padding: 8px 10px; /* Ultra compact */
  }

  .footer-text {
    font-size: 0.75rem;
    margin-bottom: 2px;
  }

  .footer-links {
    font-size: 0.7rem;
  }
}
</style>
