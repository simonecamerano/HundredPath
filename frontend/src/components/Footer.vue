<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="footer-credit">
        Made with ❤️ by <a href="https://www.simonecamerano.dev" target="_blank" rel="noopener noreferrer">Simone Camerano</a>
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
  margin-top: 40px;
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
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.footer-credit a {
  color: var(--color-purple);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.footer-credit a:hover {
  color: var(--color-pink);
}

.footer-credit a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-purple), var(--color-pink));
  transition: width 0.3s ease;
}

.footer-credit a:hover::after {
  width: 100%;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.85rem;
}

.footer-link {
  color: #495057;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--color-purple);
}

.separator {
  color: #adb5bd;
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
