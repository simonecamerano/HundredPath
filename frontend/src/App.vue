<template>
  <div class="app-container">
    <Navbar />
    <router-view></router-view>
  </div>
</template>
<script setup>
import Navbar from "./components/Navbar.vue";
// Logic here
</script>
<style>
.app-container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}
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
  background-size: 40px 40px; /* Effetto quadrettato */
  background-attachment: fixed; /* Lo sfondo sta fermo mentre scrolli */
  min-height: 100vh;
}
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
</style>
