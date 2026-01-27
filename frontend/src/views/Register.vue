<template>
  <div class="page-wrapper">
    <div class="container-xs">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="text-gradient">Crea Account</h1>
          <p class="auth-subtitle">Inizia la tua avventura su HundredPath</p>
        </div>

        <form @submit.prevent="register" class="auth-form">
          <div class="input-group">
            <label class="label">Username</label>
            <div style="position: relative">
              <User :size="18" class="input-icon" />
              <input
                v-model="username"
                type="text"
                required
                class="input"
                placeholder="Il tuo username"
                style="padding-left: 40px"
              />
            </div>
          </div>

          <div class="avatar-section">
            <label class="label">Scegli il tuo Avatar</label>

            <div v-if="selectedAvatar" class="avatar-preview">
              <img
                :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedAvatar}`"
                alt="Avatar Preview"
              />
            </div>

            <button
              type="button"
              @click="generateRandomAvatar"
              class="btn btn-secondary btn-sm"
            >
              <Shuffle :size="16" />
              Nuovi Avatar Casuali
            </button>

            <div class="avatar-grid">
              <div
                v-for="seed in avatarOptions"
                :key="seed"
                class="avatar-option"
                :class="{ selected: selectedAvatar === seed }"
                @click="selectedAvatar = seed"
              >
                <img
                  :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`"
                  alt="Avatar"
                />
              </div>
            </div>
          </div>

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
                placeholder="Minimo 6 caratteri"
                style="padding-left: 40px"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-gradient btn-lg">
            <UserPlus :size="20" />
            Registrati Gratis
          </button>
        </form>

        <div class="auth-footer">
          <p>Hai già un account?</p>
          <router-link to="/login" class="link-gradient">
            Accedi ora
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Lock, Mail, Shuffle, User, UserPlus } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "../composables/useNotification";
import api from "../services/api";

const router = useRouter();
const { success: notifySuccess, error: notifyError, warning: notifyWarning } = useNotification();
const username = ref("");
const email = ref("");
const password = ref("");

const avatarOptions = ref([]);
const selectedAvatar = ref(null);

function generateRandomAvatar() {
  avatarOptions.value = [];
  for (let i = 0; i < 12; i++) {
    avatarOptions.value.push("User_" + Math.floor(Math.random() * 100000));
  }
  selectedAvatar.value = avatarOptions.value[0];
}

// Generate initial avatars
generateRandomAvatar();

async function register() {
  if (!selectedAvatar.value) {
    notifyWarning("Per favore seleziona un avatar!");
    return;
  }
  try {
    await api.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      avatar: selectedAvatar.value,
    });
    notifySuccess("Registrazione completata! Ora puoi fare il login.");
    router.push("/login");
  } catch (err) {
    console.error("Error registering:", err);
    notifyError(err.response?.data?.error || "Registrazione fallita");
  }
}
</script>

<style scoped src="../styles/auth.css"></style>
