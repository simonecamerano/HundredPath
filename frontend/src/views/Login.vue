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

<style scoped>
.auth-card {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.4s ease-out;
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.auth-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
  font-weight: 800;
}

.auth-subtitle {
  color: var(--color-gray-600);
  font-size: 1.1rem;
}

.auth-form {
  margin-bottom: var(--space-lg);
}

.error-message {
  background: #fff5f5;
  color: var(--color-error);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid #ffcccc;
  text-align: center;
  margin-top: var(--space-md);
}

.auth-footer {
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-gray-200);
}

.auth-footer p {
  color: var(--color-gray-600);
  margin-bottom: var(--space-sm);
}

.link-gradient {
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-size: 1.1rem;
  transition: opacity 0.2s;
}

.link-gradient:hover {
  opacity: 0.8;
}
</style>
