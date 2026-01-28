<template>
  <div class="page-wrapper">
    <div class="container-md">
      <div class="legal-document">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last updated: January 27, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using HundredPath ("the Service"), you accept and agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            HundredPath is a free online logic puzzle game where players complete a path on a 10x10 grid
            following specific movement rules. The Service includes account creation, gameplay, leaderboards, and statistics tracking.
          </p>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <p>To use certain features of the Service, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Use only one account per person</li>
          </ul>
          <p>You must be at least 13 years old to create an account.</p>
        </section>

        <section>
          <h2>4. Username Guidelines</h2>
          <p>Your username must:</p>
          <ul>
            <li>Be between 3-10 characters in length</li>
            <li>Not contain offensive, vulgar, or inappropriate language</li>
            <li>Not impersonate others or infringe on trademarks</li>
            <li>Not include spam or promotional content</li>
          </ul>
          <p>We reserve the right to remove or modify usernames that violate these guidelines.</p>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Cheat, exploit bugs, or use unauthorized third-party software</li>
            <li>Attempt to gain unauthorized access to the Service or other accounts</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Submit false or manipulated scores</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Scrape, data mine, or use automated tools without permission</li>
            <li>Reverse engineer or decompile the Service</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of HundredPath, including but not limited to text, graphics,
            logos, and software, are owned by Simone Camerano and protected by copyright and other intellectual property laws.
          </p>
          <p>You may not copy, modify, distribute, or create derivative works without explicit permission.</p>
        </section>

        <section>
          <h2>7. User Content</h2>
          <p>
            Your game scores and statistics are stored and displayed publicly on leaderboards.
            By using the Service, you grant us the right to display this data as part of the game functionality.
          </p>
        </section>

        <section>
          <h2>8. Account Suspension and Termination</h2>
          <p>We reserve the right to suspend or terminate your account at any time if:</p>
          <ul>
            <li>You violate these Terms of Service</li>
            <li>Your account is inactive for an extended period</li>
            <li>We are required to do so by law</li>
            <li>We discontinue the Service</li>
          </ul>
          <p>You may delete your account at any time from your Profile page.</p>
        </section>

        <section>
          <h2>9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p>
            We do not guarantee that the Service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SIMONE CAMERANO SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
            WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </p>
        </section>

        <section>
          <h2>11. Password Recovery</h2>
          <p>
            If you forget your password, contact us at 
            <a href="mailto:info@simonecamerano.dev">info@simonecamerano.dev</a>
            with your registered email address. We will verify your identity before assisting with account recovery.
          </p>
          <p>
            <strong>Important:</strong> Never share your password with anyone. We will never ask for your password via email.
          </p>
        </section>

        <section>
          <h2>12. Changes to Service</h2>
          <p>
            We reserve the right to modify or discontinue the Service at any time, with or without notice.
            We will not be liable to you or any third party for any modification, suspension, or discontinuation.
          </p>
        </section>

        <section>
          <h2>13. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify you of material changes
            by updating the "Last updated" date. Your continued use of the Service after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2>14. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Italy,
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>15. Contact Information</h2>
          <p>
            For questions about these Terms of Service, contact us at:
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
