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
  font-family: "Arial", sans-serif;
  background-color: #f0f2f5;
  color: #333;
}
.app-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
</style>
