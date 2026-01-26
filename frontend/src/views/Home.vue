<script setup>
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
</script>

<template>
  <div class="home-container">
    <!-- HERO SECTION -->
    <header class="hero">
      <div class="hero-content">
        <h1 class="title">HundredPath</h1>
        <p class="subtitle">La sfida logica 10x10. Raggiungi il 100.</p>

        <!-- CTA OSPITI -->
        <div v-if="!authStore.isAuthenticated" class="guest-section">
          <div class="cta-group">
            <router-link to="/game" class="btn btn-primary pulse"
              >Prova Subito 🚀</router-link
            >
            <router-link to="/register" class="btn btn-outline"
              >Registrati</router-link
            >
          </div>
          <p class="guest-hint">Non serve registrarsi per provare!</p>
        </div>

        <!-- CTA LOGGATI -->
        <div v-else class="cta-group">
          <router-link to="/game" class="btn btn-primary pulse"
            >Gioca Ora 🎮</router-link
          >
          <router-link to="/userbestscores" class="btn btn-outline"
            >I Miei Record 🏆</router-link
          >
        </div>
      </div>
    </header>

    <!-- FEATURES -->
    <section class="features">
      <div class="feature-card">
        <div class="icon">🧩</div>
        <h3>Griglia 10x10</h3>
        <p>Muoviti saltando 2 caselle in orizzontale o 1 in diagonale.</p>
      </div>
      <div class="feature-card">
        <div class="icon">⏱️</div>
        <h3>Speedrun</h3>
        <p>Completa il percorso nel minor tempo possibile.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🏆</div>
        <h3>Classifica</h3>
        <p>Scala la vetta globale e sfida i tuoi amici.</p>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <p>&copy; 2025 HundredPath - Developed with ❤️ by Simone Camerano</p>
    </footer>
  </div>
</template>

<style scoped>
/* CONTAINER */
.home-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 0px; /* Ridotto drasticamente */
}

/* HERO SECTION */
.hero {
  text-align: center;
  padding: 0 20px 40px; /* Tolto padding top: 0, laterale 20, sotto 40 */
  max-width: 800px;
}

.title {
  font-size: 4rem;
  margin-bottom: 10px;
  font-weight: 800;
  background: -webkit-linear-gradient(45deg, #007bff, #6610f2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -2px;
}

.subtitle {
  font-size: 1.5rem;
  color: #6c757d;
  margin-bottom: 40px;
  font-weight: 300;
}

/* CTA BUTTONS */
.cta-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 15px;
}

.btn {
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 50px; /* Pill shape */
  text-decoration: none;
  font-weight: bold;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.btn-primary {
  background: #007bff;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-outline {
  border: 2px solid #007bff;
  color: #007bff;
  background: white;
}

.btn-outline:hover {
  background: #f0f8ff;
}

.guest-hint {
  font-size: 0.9rem;
  color: #adb5bd;
  margin-top: 40px;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

/* FEATURES SECTION */
.features {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  width: 250px;
  text-align: center;
  border: 1px solid #f1f3f5;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #343a40;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
}

footer {
  margin-top: 80px;
  color: #ced4da;
  font-size: 0.8rem;
  padding-bottom: 20px;
}

/* MOBILE */
@media (max-width: 600px) {
  .title {
    font-size: 2.5rem;
  }
  .cta-group {
    flex-direction: column;
  }
  .features {
    gap: 15px;
  }
  .feature-card {
    width: 100%;
  }
}
</style>
