<template>
  <div class="page-wrapper">
    <div class="container-xs">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="text-gradient">Bentornato!</h1>
          <p class="auth-subtitle">Accedi al tuo account</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="input-group">
            <label class="label">Email</label>
            <div style="position: relative">
              <Mail :size="18" class="input-icon" />
              <input
                v-model="email"
                type="email"
                required
                class="input"
                placeholder="tuaemail@esempio.com"
                style="padding-left: 40px"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="label">Password</label>
            <div style="position: relative">
              <Lock :size="18" class="input-icon" />
              <input
                v-model="password"
                type="password"
                required
                class="input"
                placeholder="••••••••"
                style="padding-left: 40px"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-gradient btn-lg">
            <LogIn :size="20" />
            Accedi
          </button>
        </form>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="auth-footer">
          <p>Non hai un account?</p>
          <router-link to="/register" class="link-gradient">
            Registrati ora
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Lock, LogIn, Mail } from "lucide-vue-next";
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
    router.push("/");
  } catch (err) {
    error.value = err;
  }
}
</script>

<style scoped src="../styles/auth.css"></style>
