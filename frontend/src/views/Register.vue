<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Username:</label>
      <input type="text" v-model="username" placeholder="Username" required />
<br>
      <label>Scegli il tuo Avatar:</label>

      <!-- PREVIEW AVATAR SELEZIONATO -->
      <div v-if="selectedAvatar" class="avatar-preview">
        <img
          :src="`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedAvatar}`"
          alt="Avatar Preview"
        />
      </div>
      <div class="avatar-actions">
        <button type="button" @click="generateRandomAvatar" class="btn-random">
          🎲 Random Avatar
        </button>
      </div>

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

      <label>Email:</label>
      <input type="email" v-model="email" placeholder="Email" required />
      <label>Password:</label>
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit" class="btn-register">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

// Opzioni Avatar (Semi random o semi statici per scelta)
const avatarOptions = [];
const selectedAvatar = ref(null);
// Nessun default
function generateRandomAvatar() {
avatarOptions.length = 0;
for (let i = 0; i < 12; i++) {
  avatarOptions.push("User_" + Math.floor(Math.random() * 100000));
}
selectedAvatar.value = avatarOptions[0];
}
generateRandomAvatar();

async function register() {
  if (!selectedAvatar.value) {
    alert("Per favore seleziona un avatar!");
    return;
  }
  try {
    await api.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      avatar: selectedAvatar.value, // Inviamo la scelta!
    });
    alert("Registration successful! You can now login.");
    router.push("/login");
  } catch (err) {
    console.error("Error registering:", err);
    alert(err.response?.data?.error || "Registration failed");
  }
}
</script>

<style scoped>
.register-container {
  max-width: 350px;
  margin: 0 auto;
  text-align: left;
}
input {
  display: block;
  width: 100%;
  margin-bottom: 5px; /* ridotto un po' */
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
label {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 2px;
  display: block;
}
.btn-register {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 15px;
  border-radius: 4px;
  font-weight: bold;
}
.error {
  color: red;
  margin-top: 10px;
}

/* Griglia Avatar */
.avatar-grid {
  display: flex;
  gap: 10px;
  margin: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
.avatar-option {
  width: 60px; /* Un po' più piccoli */
  height: 60px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s,
    border-color 0.2s;
  background: #eee;
}
.avatar-option img {
  width: 100%;
  height: 100%;
}
.avatar-option:hover {
  transform: scale(1.1);
}
.avatar-option.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
  transform: scale(1.1);
}

/* Random & Preview */
.avatar-actions {
  text-align: center;
  margin-bottom: 10px;
}
.btn-random {
  background: #6c757d;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 20px 0;
}
.btn-random:hover {
  background: #5a6268;
}

.avatar-preview {
  text-align: center;
  margin: 15px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 10px;
}
.avatar-preview img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #007bff;
  background: white;
}
.preview-label {
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: #666;
  font-family: monospace;
}
</style>
