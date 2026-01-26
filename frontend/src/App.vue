<template>
  <div class="app-layout">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>
<script setup>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
</script>
<style>
/* Global styles */
body {
  margin: 0;
  font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333;
  /* CLEAN UI GRID BACKGROUND */
  background: radial-gradient(circle at center, #ffffff 0%, #f8f9fa 100%);
  background-image:
    linear-gradient(#e9ecef 1px, transparent 1px),
    linear-gradient(90deg, #e9ecef 1px, transparent 1px);
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
