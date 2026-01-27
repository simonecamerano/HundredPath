# Translation Implementation Plan for HundredPath

This document provides a step-by-step plan to implement English translations across the entire HundredPath frontend application.

---

## Phase 1: Setup i18n Infrastructure

### 1.1 Install Dependencies

```bash
cd frontend
npm install vue-i18n@9
```

### 1.2 Create Translation Files

Create directory structure:
```
frontend/src/locales/
  ├── en.json
  └── it.json
```

### 1.3 Initialize i18n in main.js

```javascript
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import it from './locales/it.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en', // default locale
  fallbackLocale: 'it',
  messages: {
    en,
    it
  }
})

app.use(i18n)
```

---

## Phase 2: Create Translation Keys

### 2.1 English Translations (en.json)

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "logout": "Logout",
    "login": "Log In",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "username": "Username",
    "guest": "Guest"
  },
  "nav": {
    "leaderboards": "Leaderboards",
    "bestScores": "Best Scores",
    "users": "Users",
    "community": "Community",
    "profile": "Profile",
    "tutorial": "Tutorial",
    "ranked": "Ranked",
    "competitive": "Competitive",
    "learnRules": "Learn the rules",
    "challengeBest": "Challenge the best",
    "myBestScores": "My Best Scores",
    "yourBestScores": "Your best scores",
    "searchPlayers": "Search other players",
    "registerFree": "Register Free",
    "manageProfile": "Manage Profile"
  },
  "footer": {
    "tagline": "The 10×10 Logic Game"
  },
  "home": {
    "title": "HundredPath",
    "subtitle": "The 10×10 logic challenge. Find the right path and reach 100!",
    "alphaRelease": "Alpha release!",
    "learnWithHints": "Learn the rules with visual aids",
    "startNow": "Start now",
    "registerToUnlock": "to unlock Ranked mode!",
    "practiceWithHints": "Practice with hints",
    "completeOneTutorial": "Complete 1 tutorial",
    "gridTitle": "10×10 Grid",
    "gridDesc": "Move by jumping 2 squares horizontally or 1 diagonally.",
    "speedrunTitle": "Speedrun",
    "speedrunDesc": "Complete the path in the shortest time possible.",
    "leaderboardTitle": "Leaderboard",
    "leaderboardDesc": "Climb the global rankings and challenge your friends."
  },
  "game": {
    "undo": "Undo",
    "restart": "Restart",
    "abandon": "Abandon",
    "ready": "Ready",
    "start": "START",
    "victory": "VICTORY!",
    "gameOver": "GAME OVER",
    "completedIn": "Completed in",
    "finalScore": "Final Score:",
    "time": "Time:",
    "newGame": "New Game",
    "exit": "Exit",
    "startingPosRandom": "The starting position is random.",
    "registerToSave": "Register to save your record on the leaderboard!",
    "registerNow": "Register Now",
    "dontGiveUp": "Don't give up! Register to climb the leaderboard.",
    "createAccount": "Create Account"
  },
  "leaderboard": {
    "title": "Leaderboards",
    "subtitle": "Climb the global rankings",
    "allTime": "All Time",
    "weekly": "Weekly",
    "daily": "Daily",
    "rank": "Rank",
    "player": "Player",
    "score": "Score",
    "time": "Time",
    "yourRank": "Your Rank",
    "noMatches": "No matches completed",
    "errorLoading": "Error loading leaderboards"
  },
  "profile": {
    "chooseAvatar": "Choose a new avatar",
    "newAvatars": "New Avatars",
    "saveAvatar": "Save Avatar",
    "memberSince": "Member since",
    "yourStats": "Your Statistics",
    "gamesPlayed": "Games Played",
    "wins": "Wins",
    "bestRank": "Best Rank",
    "avgTime": "Average Time",
    "recentGames": "Recent Games",
    "avatarUpdated": "Avatar updated!",
    "errorSavingAvatar": "Error saving avatar",
    "errorLoadingProfile": "Error loading profile"
  },
  "userBestScores": {
    "title": "Your Best Scores",
    "subtitle": "Your best performances in Ranked mode",
    "noRecords": "No records yet",
    "completeRanked": "Complete Ranked matches to see your records!",
    "startRanked": "Start Ranked Match",
    "score": "Score",
    "errorLoading": "Error loading records"
  },
  "users": {
    "title": "HundredPath Community",
    "registeredPlayers": "registered players",
    "games": "Games",
    "wins": "Wins",
    "bestRank": "Best Rank",
    "errorLoading": "Unable to load users"
  },
  "auth": {
    "welcomeBack": "Welcome back!",
    "loginToAccount": "Log in to your account",
    "emailPlaceholder": "youremail@example.com",
    "passwordPlaceholder": "••••••••",
    "noAccount": "Don't have an account?",
    "registerNow": "Register now",
    "createAccount": "Create Account",
    "startAdventure": "Start your adventure on HundredPath",
    "yourUsername": "Your username",
    "chooseAvatar": "Choose your Avatar",
    "newRandomAvatars": "New Random Avatars",
    "minChars": "Minimum 6 characters",
    "alreadyAccount": "Already have an account?",
    "loginNow": "Log in now",
    "pleaseSelectAvatar": "Please select an avatar!",
    "registrationComplete": "Registration complete! You can now log in.",
    "registrationFailed": "Registration failed"
  }
}
```

### 2.2 Italian Translations (it.json)

```json
{
  "common": {
    "loading": "Caricamento...",
    "error": "Errore",
    "success": "Successo",
    "cancel": "Annulla",
    "confirm": "Conferma",
    "save": "Salva",
    "logout": "Logout",
    "login": "Accedi",
    "register": "Registrati",
    "email": "Email",
    "password": "Password",
    "username": "Username",
    "guest": "Ospite"
  },
  "nav": {
    "leaderboards": "Classifiche",
    "bestScores": "Record",
    "users": "Utenti",
    "community": "Community",
    "profile": "Profilo",
    "tutorial": "Tutorial",
    "ranked": "Ranked",
    "competitive": "Competitiva",
    "learnRules": "Impara le regole",
    "challengeBest": "Sfida i migliori",
    "myBestScores": "I Miei Record",
    "yourBestScores": "I tuoi punteggi migliori",
    "searchPlayers": "Cerca altri giocatori",
    "registerFree": "Registrati Gratis",
    "manageProfile": "Gestisci Profilo"
  },
  "footer": {
    "tagline": "Il Gioco Logico 10x10"
  },
  "home": {
    "title": "HundredPath",
    "subtitle": "La sfida logica 10×10. Trova il percorso giusto e raggiungi il 100!",
    "alphaRelease": "Alpha release!",
    "learnWithHints": "Impara le regole con gli aiuti visivi",
    "startNow": "Inizia ora",
    "registerToUnlock": "per sbloccare la modalità Ranked!",
    "practiceWithHints": "Pratica con aiuti",
    "completeOneTutorial": "Finisci 1 tutorial",
    "gridTitle": "Griglia 10×10",
    "gridDesc": "Muoviti saltando 2 caselle in orizzontale o 1 in diagonale.",
    "speedrunTitle": "Speedrun",
    "speedrunDesc": "Completa il percorso nel minor tempo possibile.",
    "leaderboardTitle": "Classifica",
    "leaderboardDesc": "Scala la vetta globale e sfida i tuoi amici."
  },
  "game": {
    "undo": "Undo",
    "restart": "Ricomincia",
    "abandon": "Abbandona",
    "ready": "Pronto",
    "start": "START",
    "victory": "VITTORIA!",
    "gameOver": "GAME OVER",
    "completedIn": "Completato in",
    "finalScore": "Punteggio Finale:",
    "time": "Tempo:",
    "newGame": "Nuova Partita",
    "exit": "Esci",
    "startingPosRandom": "La posizione di partenza è casuale.",
    "registerToSave": "Registrati per salvare il tuo record in classifica!",
    "registerNow": "Registrati Ora",
    "dontGiveUp": "Non mollare! Registrati per scalare la classifica.",
    "createAccount": "Crea Account"
  },
  "leaderboard": {
    "title": "Classifiche",
    "subtitle": "Scala la vetta globale",
    "allTime": "Generale",
    "weekly": "Settimanale",
    "daily": "Giornaliera",
    "rank": "Pos",
    "player": "Giocatore",
    "score": "Punteggio",
    "time": "Tempo",
    "yourRank": "La Tua Posizione",
    "noMatches": "Nessuna partita completata",
    "errorLoading": "Errore nel caricamento delle classifiche"
  },
  "profile": {
    "chooseAvatar": "Scegli un nuovo avatar",
    "newAvatars": "Nuovi Avatar",
    "saveAvatar": "Salva Avatar",
    "memberSince": "Membro dal",
    "yourStats": "Le Tue Statistiche",
    "gamesPlayed": "Partite Giocate",
    "wins": "Vittorie",
    "bestRank": "Miglior Posizione",
    "avgTime": "Tempo Medio",
    "recentGames": "Partite Recenti",
    "avatarUpdated": "Avatar aggiornato!",
    "errorSavingAvatar": "Errore nel salvataggio dell'avatar",
    "errorLoadingProfile": "Errore nel caricamento del profilo"
  },
  "userBestScores": {
    "title": "I Tuoi Record",
    "subtitle": "Le tue migliori prestazioni in modalità Ranked",
    "noRecords": "Nessun record ancora",
    "completeRanked": "Completa delle partite in modalità Ranked per vedere i tuoi record!",
    "startRanked": "Inizia Partita Ranked",
    "score": "Punteggio",
    "errorLoading": "Errore nel caricamento dei record"
  },
  "users": {
    "title": "Community HundredPath",
    "registeredPlayers": "giocatori registrati",
    "games": "Partite",
    "wins": "Vittorie",
    "bestRank": "Miglior Rank",
    "errorLoading": "Impossibile caricare gli utenti"
  },
  "auth": {
    "welcomeBack": "Bentornato!",
    "loginToAccount": "Accedi al tuo account",
    "emailPlaceholder": "tuaemail@esempio.com",
    "passwordPlaceholder": "••••••••",
    "noAccount": "Non hai un account?",
    "registerNow": "Registrati ora",
    "createAccount": "Crea Account",
    "startAdventure": "Inizia la tua avventura su HundredPath",
    "yourUsername": "Il tuo username",
    "chooseAvatar": "Scegli il tuo Avatar",
    "newRandomAvatars": "Nuovi Avatar Casuali",
    "minChars": "Minimo 6 caratteri",
    "alreadyAccount": "Hai già un account?",
    "loginNow": "Accedi ora",
    "pleaseSelectAvatar": "Per favore seleziona un avatar!",
    "registrationComplete": "Registrazione completata! Ora puoi fare il login.",
    "registrationFailed": "Registrazione fallita"
  }
}
```

---

## Phase 3: Update Vue Components

### 3.1 Import i18n in Components

In `<script setup>`:
```javascript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
```

### 3.2 Replace Hardcoded Strings

**Before:**
```vue
<h1>Classifiche</h1>
```

**After:**
```vue
<h1>{{ t('leaderboard.title') }}</h1>
```

---

## Phase 4: Component-by-Component Refactoring

### Priority Order:

1. ✅ **ConfirmDialog.vue** (3 strings)
2. ✅ **Navbar.vue** (24 strings)
3. ✅ **Footer.vue** (1 string)
4. ✅ **Login.vue** (8 strings)
5. ✅ **Register.vue** (16 strings)
6. ✅ **Home.vue** (17 strings)
7. ✅ **Game.vue** (28 strings)
8. ✅ **Leaderboard.vue** (15 strings)
9. ✅ **Profile.vue** (16 strings)
10. ✅ **UserBestScores.vue** (9 strings)
11. ✅ **Users.vue** (7 strings)

---

## Phase 5: Add Language Switcher (Optional)

### 5.1 Create LanguageSwitcher Component

```vue
<template>
  <div class="language-switcher">
    <button @click="setLocale('en')" :class="{ active: locale === 'en' }">
      🇬🇧 EN
    </button>
    <button @click="setLocale('it')" :class="{ active: locale === 'it' }">
      🇮🇹 IT
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function setLocale(lang) {
  locale.value = lang
  localStorage.setItem('preferredLanguage', lang)
}

// Restore preferred language on mount
onMounted(() => {
  const saved = localStorage.getItem('preferredLanguage')
  if (saved) locale.value = saved
})
</script>
```

### 5.2 Add to Navbar

Place the language switcher in the navbar for easy access.

---

## Phase 6: Testing Checklist

- [ ] All page titles display correctly in English
- [ ] All buttons show English labels
- [ ] All form inputs have English placeholders
- [ ] All error messages appear in English
- [ ] All notifications appear in English
- [ ] Language switcher works correctly
- [ ] Language preference persists across sessions
- [ ] No console errors related to missing translation keys
- [ ] All dynamic content (dates, numbers) formats correctly

---

## Phase 7: Backend Considerations (Future)

If you need to translate backend error messages:

1. Return error codes from backend
2. Map error codes to translations in frontend
3. Example:
   ```javascript
   // Backend returns: { error: 'USER_NOT_FOUND' }
   // Frontend translates: t('errors.USER_NOT_FOUND')
   ```

---

## Quick Reference: Common Replacements

| Italian | English Key | English Text |
|---------|-------------|--------------|
| `Caricamento...` | `common.loading` | `Loading...` |
| `Registrati` | `common.register` | `Register` |
| `Accedi` | `common.login` | `Log In` |
| `Classifiche` | `nav.leaderboards` | `Leaderboards` |
| `Errore` | `common.error` | `Error` |
| `Conferma` | `common.confirm` | `Confirm` |
| `Annulla` | `common.cancel` | `Cancel` |

---

## Estimated Implementation Time

- **Phase 1 (Setup):** 30 minutes
- **Phase 2 (Translation files):** 1 hour
- **Phase 3-4 (Component refactoring):** 4-6 hours
- **Phase 5 (Language switcher):** 1 hour
- **Phase 6 (Testing):** 1-2 hours

**Total:** ~8-11 hours

---

## Tips for Success

1. **Test incrementally** - Update one component at a time and test immediately
2. **Use consistent key naming** - Follow the structure shown above
3. **Keep keys organized** - Group related translations together
4. **Add missing keys gradually** - Don't worry about having every possible string upfront
5. **Use fallback locale** - Set Italian as fallback so nothing breaks during migration
6. **Check pluralization** - vue-i18n supports plural forms if needed later

---

*Last updated: 2026-01-27*
