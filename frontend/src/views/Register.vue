<template>
  <div class="register-container">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Username:</label>
      <input type="text" v-model="username" placeholder="Username" required />
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

async function register() {
  try {
    await api.post("/auth/register", {
      username: username.value,
      email: email.value,
      password: password.value,
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
