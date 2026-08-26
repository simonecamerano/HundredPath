<template>
  <div class="page-wrapper">
    <div class="container-md">
      <div class="legal-document">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: August 24, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to HundredPath. We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information when you use our game.
          </p>
        </section>

        <section>
          <h2>2. Data Controller</h2>
          <p>
            The data controller responsible for your personal data is:<br />
            <strong>Simone Camerano</strong><br />
            Email: <a href="mailto:info@simonecamerano.dev">info@simonecamerano.dev</a>
          </p>
        </section>

        <section>
          <h2>3. Data We Collect</h2>
          <p>We collect and process the following personal data:</p>
          <ul>
            <li><strong>Account Information:</strong> Username, email address, encrypted password</li>
            <li><strong>Profile Data:</strong> Selected avatar, game statistics</li>
            <li><strong>Game Data:</strong> Scores, completion times, game modes played</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information (via server logs)</li>
          </ul>
        </section>

        <section>
          <h2>4. How We Use Your Data</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul>
            <li>To create and manage your account</li>
            <li>To provide game functionality and save your progress</li>
            <li>To display leaderboards and statistics</li>
            <li>To communicate with you about your account</li>
            <li>To improve our services and user experience</li>
            <li>To ensure security and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2>5. Legal Basis for Processing</h2>
          <p>We process your personal data based on:</p>
          <ul>
            <li><strong>Contract Performance:</strong> To provide the game service you registered for</li>
            <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
            <li><strong>Consent:</strong> Where you have given explicit consent</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Storage and Security</h2>
          <p>
            Your account and game data are stored on MongoDB Atlas servers located in Frankfurt, Germany,
            inside the European Union. Both the pages you are reading and the game API run on a single server
            in Germany, so no third party outside the European Union delivers this website. MongoDB, Inc. is a
            US company acting as our data processor: your data is held in the European Union, and any transfer
            outside the EU relies on the Standard Contractual Clauses approved by the European Commission
            (Art. 46 GDPR).
            We implement appropriate technical and organizational measures to protect your data, including:
          </p>
          <ul>
            <li>Password encryption using bcrypt</li>
            <li>Secure HTTPS connections</li>
            <li>JWT token-based authentication</li>
            <li>Regular security updates</li>
          </ul>
          <p>
            We retain your account data for as long as your account is active. Accounts with no login for
            <strong>24 consecutive months</strong> are deleted, along with their scores and statistics. You can
            also delete your account at any time yourself, as described in section 9.
          </p>
        </section>

        <section>
          <h2>7. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share your data with:
          </p>
          <ul>
            <li><strong>Service Providers:</strong> Hetzner Online GmbH (server delivering the web pages you
            are reading and running the game API, Germany), MongoDB Atlas (database, Frankfurt)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <p>Your username and scores are publicly visible on leaderboards.</p>
        </section>

        <section>
          <h2>8. Your Rights (GDPR)</h2>
          <p>Under GDPR, you have the following rights:</p>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your account and data</li>
            <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
            <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Right to Object:</strong> Object to certain data processing</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
          <p>
            To exercise these rights, contact us at 
            <a href="mailto:info@simonecamerano.dev">info@simonecamerano.dev</a>
          </p>
        </section>

        <section>
          <h2>8b. Lodging a Complaint</h2>
          <p>
            If you believe your data is not being handled lawfully, you can lodge a complaint with the Italian
            data protection authority, Garante per la protezione dei dati personali
            (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>),
            or with the supervisory authority of the country where you live.
          </p>
        </section>

        <section>
          <h2>9. Account Deletion</h2>
          <p>
            You can delete your account at any time from your Profile page.
            This will permanently remove all your personal data, including scores and statistics.
            Copies contained in our backups are removed in the normal rotation cycles,
            within 21 days of the deletion.
          </p>
        </section>

        <section>
          <h2>10. Password Recovery</h2>
          <p>
            If you forget your password, please contact us at 
            <a href="mailto:info@simonecamerano.dev">info@simonecamerano.dev</a>
            with your registered email address. We will verify your identity and assist with account recovery.
          </p>
        </section>

        <section>
          <h2>11. Cookies and Local Storage</h2>
          <p>
            <strong>We do not use cookies at all</strong>: no technical, analytics,
            profiling or advertising cookies. If you only open the site without
            signing in and without playing, nothing is written to your device. This
            is why you will not see a consent banner: there is nothing to consent to.
          </p>
          <p>
            While you use the game, we store the following items in your browser's
            localStorage, on your device only. They are never sent to third parties.
          </p>
          <ul>
            <li><strong>token</strong>: your authentication token (JWT), so you stay signed in between pages.</li>
            <li><strong>user</strong>: your profile as returned by the server (username, email, avatar and game statistics), so the interface can show it without asking the server again.</li>
            <li><strong>tutorialSeen</strong>, <strong>tutorialSeen_ranked</strong> and <strong>tutorialSeen_mastermind</strong>: a bookmark per game mode, so the tutorial is not shown again after you have closed it.</li>
          </ul>
          <p>
            All of them are strictly necessary to provide the service you asked for,
            so no separate consent is required. None of them tracks you, builds a
            profile or follows you across other websites. You can clear them at any
            time by signing out or by clearing site data in your browser settings.
          </p>
        </section>

        <section>
          <h2>12. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>MongoDB Atlas:</strong> Database hosting (Privacy Policy: <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener">mongodb.com/legal/privacy-policy</a>)</li>
            <li><strong>Avatars:</strong> your avatar is drawn by your own browser using the open source
            DiceBear library, which is part of this website. No request leaves your browser to generate it, so
            no avatar service receives your IP address.</li>
          </ul>
        </section>

        <section>
          <h2>13. Children's Privacy</h2>
          <p>
            HundredPath is not intended for children under 13 years of age.
            We do not knowingly collect data from children under 13.
          </p>
        </section>

        <section>
          <h2>14. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes
            by updating the "Last updated" date at the top of this policy.
          </p>
        </section>

        <section>
          <h2>15. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or wish to exercise your rights, contact us:
          </p>
          <p>
            Email: <a href="mailto:info@simonecamerano.dev">info@simonecamerano.dev</a><br />
            Name: Simone Camerano
          </p>
        </section>

        <div class="back-link">
          <router-link to="/" class="link-gradient">← Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No reactive data needed for static page
</script>

<style scoped>
.legal-document {
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  margin: var(--space-xl) 0;
  line-height: 1.7;
}

.legal-document h1 {
  font-size: 2.5rem;
  color: var(--color-purple);
  margin-bottom: var(--space-sm);
  font-weight: 800;
}

.last-updated {
  color: var(--color-gray-500);
  font-size: 0.9rem;
  margin-bottom: var(--space-xl);
  font-style: italic;
}

.legal-document section {
  margin-bottom: var(--space-xl);
}

.legal-document h2 {
  font-size: 1.5rem;
  color: var(--color-gray-800);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-md);
  font-weight: 700;
}

.legal-document p {
  color: var(--color-gray-700);
  margin-bottom: var(--space-md);
}

.legal-document ul {
  margin-left: var(--space-lg);
  margin-bottom: var(--space-md);
  color: var(--color-gray-700);
}

.legal-document li {
  margin-bottom: var(--space-sm);
}

.legal-document a {
  color: var(--color-purple);
  text-decoration: underline;
  transition: opacity 0.2s;
}

.legal-document a:hover {
  opacity: 0.7;
}

.legal-document strong {
  font-weight: 600;
  color: var(--color-gray-800);
}

.back-link {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-gray-200);
  text-align: center;
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

@media (max-width: 1100px) {
  .legal-document {
    padding: var(--space-lg);
  }

  .legal-document h1 {
    font-size: 2rem;
  }

  .legal-document h2 {
    font-size: 1.3rem;
  }
}
</style>
