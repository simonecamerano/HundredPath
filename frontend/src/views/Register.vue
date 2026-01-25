<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Username:</label>
      <input type="text" v-model="username" placeholder="Username" required />

      <label>Scegli il tuo Avatar:</label>
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
      <button type="submit">Register</button>
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
const avatarOptions = [
  "adventurer-neutral",
  "Felix",
  "Aneka",
  "Willow",
  "Midnight",
  "Shadow",
];
const selectedAvatar = ref("adventurer-neutral");

async function register() {
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
}
label {
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 2px;
  display: block;
}
button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 15px;
}
.error {
  color: red;
  margin-top: 10px;
}

/* Griglia Avatar */
.avatar-grid {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  justify-content: center;
  flex-wrap: wrap;
}
.avatar-option {
  width: 50px;
  height: 50px;
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
</style>
