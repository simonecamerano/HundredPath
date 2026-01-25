<template>
  <div class="auth-container">
    <h2>Accedi</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    router.push("/game"); // Vai al gioco dopo il login!
  } catch (err) {
    error.value = err;
  }
}
</script>
<style scoped>
.auth-container {
  max-width: 300px;
  margin: 0 auto;
  text-align: left;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
