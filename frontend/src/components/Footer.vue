<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-credit">
        Made with ❤️ by Simone Camerano
      </p>
      <div class="footer-links">
        <router-link to="/privacy-policy" class="footer-link">Privacy Policy</router-link>
        <span class="separator">·</span>
        <router-link to="/terms-of-service" class="footer-link">Terms</router-link>
        <span class="separator">·</span>
        <a href="mailto:info@simonecamerano.dev" class="footer-link">Contact</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 80px;
  padding: 20px;
  background-color: hsla(250, 100%, 98%, 1);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.footer-credit {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
}

.footer-link {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--color-purple);
}

.separator {
  color: #dee2e6;
  user-select: none;
}

@media (max-width: 600px) {
  .app-footer {
    padding: 15px;
  }

  .footer-credit {
    font-size: 0.85rem;
  }

  .footer-links {
    font-size: 0.8rem;
    gap: 6px;
  }
}
</style>
