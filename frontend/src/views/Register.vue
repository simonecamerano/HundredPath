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

const avatarOptions = [];
const selectedAvatar = ref(null);

function generateRandomAvatar() {
  avatarOptions.length = 0;
  for (let i = 0; i < 12; i++) {
    avatarOptions.push("User_" + Math.floor(Math.random() * 100000));
  }
  selectedAvatar.value = avatarOptions[0];
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

/* AVATAR SECTION */
.avatar-section {
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: linear-gradient(
    135deg,
    rgba(121, 80, 242, 0.05),
    rgba(214, 51, 132, 0.05)
  );
  border-radius: var(--radius-lg);
  border: 2px solid rgba(121, 80, 242, 0.1);
}

.avatar-preview {
  text-align: center;
  margin: var(--space-md) 0;
}

.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--color-purple);
  box-shadow: 0 4px 15px rgba(121, 80, 242, 0.3);
  background: white;
  animation: iconPop 0.3s ease-out;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s ease;
  background: white;
}

.avatar-option img {
  width: 100%;
  height: 100%;
}

.avatar-option:hover {
  transform: scale(1.1);
  border-color: var(--color-gray-300);
}

.avatar-option.selected {
  border-color: var(--color-purple);
  box-shadow: 0 0 0 3px rgba(121, 80, 242, 0.2);
  transform: scale(1.15);
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

@keyframes iconPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
