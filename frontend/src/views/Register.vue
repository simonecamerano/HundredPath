<template>
  <div class="page-wrapper">
    <div class="container-xs">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="text-gradient">Create Account</h1>
          <p class="auth-subtitle">Start your adventure on HundredPath</p>
        </div>

        <form @submit.prevent="register" class="auth-form">
          <div class="input-group">
            <label class="label" for="username-input">Username</label>
            <div style="position: relative">
              <User :size="18" class="input-icon" aria-hidden="true" />
              <input
                id="username-input"
                v-model="username"
                type="text"
                required
                class="input"
                placeholder="Your username"
                style="padding-left: 40px"
                aria-required="true"
              />
            </div>
          </div>

          <div class="avatar-section" role="group" aria-labelledby="avatar-label">
            <label class="label" id="avatar-label">Choose your Avatar</label>

            <div v-if="selectedAvatar" class="avatar-preview">
              <img
                :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedAvatar}`"
                alt="Selected avatar preview"
              />
            </div>

            <button
              type="button"
              @click="generateRandomAvatar"
              class="btn btn-secondary btn-sm"
              aria-label="Generate new random avatars"
            >
              <Shuffle :size="16" aria-hidden="true" />
              New Random Avatars
            </button>

            <div class="avatar-grid" role="radiogroup" aria-label="Avatar selection">
              <div
                v-for="seed in avatarOptions"
                :key="seed"
                class="avatar-option"
                :class="{ selected: selectedAvatar === seed }"
                @click="selectedAvatar = seed"
                role="radio"
                :aria-checked="selectedAvatar === seed"
                :aria-label="`Avatar option ${seed}`"
                tabindex="0"
              >
                <img
                  :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`"
                  :alt="`Avatar option ${seed}`"
                />
              </div>
            </div>
          </div>

          <div class="input-group">
            <label class="label" for="email-input-register">Email</label>
            <div style="position: relative">
              <Mail :size="18" class="input-icon" aria-hidden="true" />
              <input
                id="email-input-register"
                v-model="email"
                type="email"
                required
                class="input"
                placeholder="youremail@example.com"
                style="padding-left: 40px"
                aria-required="true"
              />
            </div>
          </div>

          <div class="input-group">
            <label class="label" for="password-input-register">Password</label>
            <div style="position: relative">
              <Lock :size="18" class="input-icon" aria-hidden="true" />
              <input
                id="password-input-register"
                v-model="password"
                type="password"
                required
                class="input"
                placeholder="At least 6 characters"
                style="padding-left: 40px"
                aria-required="true"
                aria-describedby="password-hint"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-gradient btn-lg">
            <UserPlus :size="20" />
            Register Free
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account?</p>
          <router-link to="/login" class="link-gradient">
            Log in now
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
    notifyWarning("Please select an avatar!");
    return;
  }
  try {
    await api.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      avatar: selectedAvatar.value,
    });
    notifySuccess("Registration complete! You can now log in.");
    router.push("/login");
  } catch (err) {
    console.error("Error registering:", err);
    notifyError(err.response?.data?.error || "Registration failed");
  }
}
</script>

<style scoped src="../styles/auth.css"></style>
