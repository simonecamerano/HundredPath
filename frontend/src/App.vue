<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Footer />
    <NotificationContainer />
    <ConfirmDialog />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import ConfirmDialog from "./components/ConfirmDialog.vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import NotificationContainer from "./components/NotificationContainer.vue";
import { useNotification } from "./composables/useNotification";

const { info } = useNotification();

// Listener per cold start detection
onMounted(() => {
  window.addEventListener('cold-start-detected', (event) => {
    const duration = event.detail.duration;
    info(
      `Server awakening completed in ${duration}s. Next requests will be instant! ⚡`,
      5000
    );
  });
});
</script>
<style>
/* Global styles */
body {
  margin: 0;
  font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333;
  /* CLEAN UI GRID BACKGROUND */
  background-color: hsla(250, 100%, 98%, 1);
  background-size: 40px 40px;
  background-attachment: fixed;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  max-width: 1200px; /* Increased max-width for better use of space */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* Ensure text centering logic is kept where needed, or let views handle it */
@media (max-width: 600px) {
  .main-content {
    padding: 10px; /* Ridotto da 20px a 10px su mobile */
  }
}
</style>
