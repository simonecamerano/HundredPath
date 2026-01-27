# Italian to English Translation Guide for HundredPath

This document contains ALL Italian text strings found in the Vue files that need translation to English.

---

## 1. Components

### 1.1 [ConfirmDialog.vue](frontend/src/components/ConfirmDialog.vue)

| Line | Italian | English |
|------|---------|---------|
| 12 | `Conferma` | `Confirm` |
| 18 | `Annulla` | `Cancel` |
| 19 | `Conferma` | `Confirm` |

---

### 1.2 [Navbar.vue](frontend/src/components/Navbar.vue)

| Line | Italian | English |
|------|---------|---------|
| 29 | `Classifiche` | `Leaderboards` |
| 33 | `Record` | `Best Scores` |
| 37 | `Utenti` | `Users` |
| 51 | `Logout` | `Logout` |
| 56 | `Classifiche` | `Leaderboards` |
| 60 | `Accedi` | `Login` |
| 64 | `Registrati` | `Register` |
| 93 | `Il Gioco Logico 10×10` | `The 10×10 Logic Game` |
| 103 | `Tutorial` | `Tutorial` |
| 104 | `Impara le regole` | `Learn the rules` |
| 115 | `Ranked` | `Ranked` |
| 116 | `Competitiva` | `Competitive` |
| 124 | `Classifiche` | `Leaderboards` |
| 125 | `Sfida i migliori` | `Challenge the best` |
| 134 | `I Miei Record` | `My Best Scores` |
| 135 | `I tuoi punteggi migliori` | `Your best scores` |
| 144 | `Community` | `Community` |
| 145 | `Cerca altri giocatori` | `Search other players` |
| 157 | `Accedi` | `Login` |
| 160 | `Registrati Gratis` | `Register Free` |
| 172 | `Gestisci Profilo` | `Manage Profile` |
| 177 | `Logout` | `Logout` |

---

### 1.3 [Footer.vue](frontend/src/components/Footer.vue)

| Line | Italian | English |
|------|---------|---------|
| 5 | `Il Gioco Logico 10x10` | `The 10x10 Logic Game` |

**Comment:** Line 7 "Made with ❤️ by Simone Camerano" is a signature and should remain as is.

---

### 1.4 [Grid.vue](frontend/src/components/Grid.vue)

**Comments:**
- Line 3: `Loop per creare 100 celle` → `Loop to create 100 cells`
- Line 4: `cellIndex va da 0 a 99` → `cellIndex goes from 0 to 99`
- Line 13: `Mostra il numero se presente, altrimenti niente` → `Show the number if present, otherwise nothing`

---

## 2. Views

### 2.1 [UserBestScores.vue](frontend/src/views/UserBestScores.vue)

| Line | Italian | English |
|------|---------|---------|
| 6 | `I Tuoi Record` | `Your Best Scores` |
| 7 | `Le tue migliori prestazioni in modalità Ranked` | `Your best performances in Ranked mode` |
| 11 | `Caricamento...` | `Loading...` |
| 17 | `Nessun record ancora` | `No records yet` |
| 19 | `Completa delle partite in modalità Ranked per vedere i tuoi record!` | `Complete Ranked matches to see your records!` |
| 22 | `Inizia Partita Ranked` | `Start Ranked Match` |
| 46 | `Punteggio` | `Score` |
| 50 | `Tempo` | `Time` |
| 113 | `Errore nel caricamento dei record` | `Error loading records` |

---

### 2.2 [Login.vue](frontend/src/views/Login.vue)

| Line | Italian | English |
|------|---------|---------|
| 6 | `Bentornato!` | `Welcome back!` |
| 7 | `Accedi al tuo account` | `Log in to your account` |
| 11 | `Email` | `Email` |
| 17 | `tuaemail@esempio.com` | `youremail@example.com` |
| 24 | `Password` | `Password` |
| 30 | `••••••••` | `••••••••` (keep as is - universal) |
| 37 | `Accedi` | `Log In` |
| 44 | `Non hai un account?` | `Don't have an account?` |
| 46 | `Registrati ora` | `Register now` |

---

### 2.3 [Profile.vue](frontend/src/views/Profile.vue)

| Line | Italian | English |
|------|---------|---------|
| 5 | `Caricamento...` | `Loading...` |
| 23 | `Membro dal` | `Member since` |
| 31 | `Scegli un nuovo avatar` | `Choose a new avatar` |
| 36 | `Nuovi Avatar` | `New Avatars` |
| 56 | `Salva Avatar` | `Save Avatar` |
| 66 | `Le Tue Statistiche` | `Your Statistics` |
| 70 | `Partite Giocate` | `Games Played` |
| 74 | `Vittorie` | `Wins` |
| 78 | `Miglior Posizione` | `Best Rank` |
| 82 | `Tempo Medio` | `Average Time` |
| 94 | `Partite Recenti` | `Recent Games` |
| 102 | `Ranked` | `Ranked` |
| 102 | `Tutorial` | `Tutorial` |
| 191 | `Avatar aggiornato!` | `Avatar updated!` |
| 194 | `Errore nel salvataggio dell'avatar` | `Error saving avatar` |
| 202 | `Errore nel caricamento del profilo` | `Error loading profile` |

**Comments:**
- Line 200: `L'API ritorna direttamente l'utente, non sotto .profile` → `The API returns the user directly, not under .profile`
- Line 201: `recentGames non è supportato dall'API attuale` → `recentGames is not supported by the current API`

---

### 2.4 [Home.vue](frontend/src/views/Home.vue)

| Line | Italian | English |
|------|---------|---------|
| 38 | `Alpha release!` | `Alpha release!` (can keep) |
| 47 | `La sfida logica 10×10. Trova il percorso giusto e raggiungi il 100!` | `The 10×10 logic challenge. Find the right path and reach 100!` |
| 65 | `Impara le regole con gli aiuti visivi` | `Learn the rules with visual aids` |
| 68 | `Inizia ora` | `Start now` |
| 79 | `Registrati` | `Register` |
| 81 | `per sbloccare la modalità Ranked!` | `to unlock Ranked mode!` |
| 92 | `Pratica con aiuti` | `Practice with hints` |
| 109 | `Competitiva` | `Competitive` |
| 110 | `Finisci 1 tutorial` | `Complete 1 tutorial` |
| 120 | `Griglia 10×10` | `10×10 Grid` |
| 121 | `Muoviti saltando 2 caselle in orizzontale o 1 in diagonale.` | `Move by jumping 2 squares horizontally or 1 diagonally.` |
| 127 | `Speedrun` | `Speedrun` (keep as is - gaming term) |
| 128 | `Completa il percorso nel minor tempo possibile.` | `Complete the path in the shortest time possible.` |
| 134 | `Classifica` | `Leaderboard` |
| 135 | `Scala la vetta globale e sfida i tuoi amici.` | `Climb the global rankings and challenge your friends.` |

**Variable name:**
- Line 19: `rankedUnlocked` is already in English ✓

---

### 2.5 [Leaderboard.vue](frontend/src/views/Leaderboard.vue)

| Line | Italian | English |
|------|---------|---------|
| 6 | `Classifiche` | `Leaderboards` |
| 7 | `Scala la vetta globale` | `Climb the global rankings` |
| 23 | `Caricamento...` | `Loading...` |
| 40 | `Pos` | `Rank` |
| 42 | `Giocatore` | `Player` |
| 43 | `Punteggio` | `Score` |
| 44 | `Tempo` | `Time` |
| 70 | `Nessuna partita completata` | `No matches completed` |
| 82 | `La Tua Posizione` | `Your Rank` |
| 127 | `Generale` | `All Time` |
| 128 | `Settimanale` | `Weekly` |
| 129 | `Giornaliera` | `Daily` |
| 175 | `Errore nel caricamento delle classifiche` | `Error loading leaderboards` |

---

### 2.6 [Register.vue](frontend/src/views/Register.vue)

| Line | Italian | English |
|------|---------|---------|
| 6 | `Crea Account` | `Create Account` |
| 7 | `Inizia la tua avventura su HundredPath` | `Start your adventure on HundredPath` |
| 11 | `Username` | `Username` (already English) |
| 17 | `Il tuo username` | `Your username` |
| 23 | `Scegli il tuo Avatar` | `Choose your Avatar` |
| 33 | `Nuovi Avatar Casuali` | `New Random Avatars` |
| 52 | `Email` | `Email` |
| 58 | `tuaemail@esempio.com` | `youremail@example.com` |
| 64 | `Password` | `Password` |
| 70 | `Minimo 6 caratteri` | `Minimum 6 characters` |
| 77 | `Registrati Gratis` | `Register Free` |
| 83 | `Hai già un account?` | `Already have an account?` |
| 85 | `Accedi ora` | `Log in now` |
| 106 | `Per favore seleziona un avatar!` | `Please select an avatar!` |
| 116 | `Registrazione completata! Ora puoi fare il login.` | `Registration complete! You can now log in.` |
| 120 | `Registrazione fallita` | `Registration failed` |

---

### 2.7 [Users.vue](frontend/src/views/Users.vue)

| Line | Italian | English |
|------|---------|---------|
| 6 | `Community HundredPath` | `HundredPath Community` |
| 9 | `giocatori registrati` | `registered players` |
| 13 | `Caricamento...` | `Loading...` |
| 32 | `Partite` | `Games` |
| 37 | `Vittorie` | `Wins` |
| 42 | `Miglior Rank` | `Best Rank` |
| 82 | `Impossibile caricare gli utenti` | `Unable to load users` |

---

### 2.8 [Game.vue](frontend/src/views/Game.vue)

| Line | Italian | English |
|------|---------|---------|
| 74 | `Ospite` | `Guest` |
| 81 | `Undo` | `Undo` (already English) |
| 85 | `Ricomincia` | `Restart` |
| 89 | `Abbandona` | `Abandon` |
| 100 | `Pronto` | `Ready` |
| 103 | `La posizione di partenza è casuale.` | `The starting position is random.` |
| 104 | `START` | `START` |
| 113 | `VITTORIA!` | `VICTORY!` |
| 115 | `Completato in` | `Completed in` |
| 119 | `Registrati per salvare il tuo record in classifica!` | `Register to save your record on the leaderboard!` |
| 121 | `Registrati Ora` | `Register Now` |
| 127 | `Nuova Partita` | `New Game` |
| 131 | `Classifica` | `Leaderboard` |
| 140 | `GAME OVER` | `GAME OVER` (already English) |
| 143 | `Punteggio Finale:` | `Final Score:` |
| 146 | `Tempo:` | `Time:` |
| 151 | `Non mollare! Registrati per scalare la classifica.` | `Don't give up! Register to climb the leaderboard.` |
| 153 | `Crea Account` | `Create Account` |
| 159 | `Ricomincia` | `Restart` |
| 163 | `Esci` | `Exit` |

**Console logs (should also be translated):**
- Line 67: `🎮 Starting game with mode:` → `🎮 Starting game with mode:`
- Line 71: `✅ Game created with mode:` → `✅ Game created with mode:`
- Line 92: `Errore start game:` → `Error starting game:`
- Line 93: `Errore durante l'inizializzazione della partita` → `Error initializing game`
- Line 123: `Errore mossa:` → `Error making move:`
- Line 125: `In caso di errore bisognerebbe revertare, per ora logghiamo` → `In case of error should revert, for now we log`
- Line 145: `Errore undo:` → `Error undoing move:`
- Line 178: `🏳️ Abandoning TUTORIAL, calling /game/over to unlock ranked` → comment (can keep)
- Line 181: `🏳️ Abandoning RANKED, deleting game (won't count)` → comment (can keep)
- Line 185: `❌ Error on abandon:` → comment (can keep)
- Line 199: `🏁 Calling /game/over for gameId:` → comment (can keep)
- Line 200: `📝 Game over response:` → comment (can keep)
- Line 204: `🎓 Tutorial completed! Ranked should unlock now.` → comment (can keep)
- Line 207: `❌ Error calling game/over:` → comment (can keep)

**Comments:**
- Line 75: `RESET STATO COMUNE` → `RESET COMMON STATE`
- Line 76: `Reset grafico` → `Reset display`
- Line 77: `Reset per sicurezza` → `Reset for safety`
- Line 80: `--- LOGICA UTENTE LOGGATO ---` → `--- LOGGED IN USER LOGIC ---`
- Line 86: `--- LOGICA OSPITE (CLIENT ONLY) ---` → `--- GUEST LOGIC (CLIENT ONLY) ---`
- Line 89: `Random start` → already English
- Line 90: `Pronto per il 2` → `Ready for number 2`
- Line 97: `Chiamata quando l'utente preme "START PARTITA"` → `Called when user presses "START GAME"`
- Line 102: `Blocco interazione` → `Block interaction`
- Line 106: `AGGIORNAMENTO OTTIMISTICO / LOCALE` → `OPTIMISTIC / LOCAL UPDATE`
- Line 108: `Salva storia per undo locale` → `Save history for local undo`
- Line 117: `--- SERVER SYNC ---` → already English
- Line 122: `In caso di errore bisognerebbe revertare, per ora logghiamo` → `In case of error should revert, for now we log`
- Line 131: `--- SERVER UNDO ---` → already English
- Line 148: `--- LOCAL UNDO ---` → already English
- Line 156: `Ricalcola lastPosition` → `Recalculate lastPosition`
- Line 161: `Se abbiamo tolto tutto, dobbiamo ritrovare l'1 (che non è in history)` → `If we removed everything, we need to find the 1 (which is not in history)`
- Line 173: `Tutorial abbandonato → salva come completed (sblocca ranked)` → `Tutorial abandoned → save as completed (unlock ranked)`
- Line 177: `Ranked abbandonato → cancella la partita (non deve contare)` → `Ranked abandoned → delete game (should not count)`
- Line 189: `Nessun suggerimento finché non parte` → `No hints until started`
- Line 198: `Solo se attivo` → `Only if active`

---

## 3. Composables

### 3.1 [useConfirm.js](frontend/src/composables/useConfirm.js)

✅ **No Italian text found** - All code is in English

---

### 3.2 [useNotification.js](frontend/src/composables/useNotification.js)

✅ **No Italian text found** - All code is in English

---

## 4. Store Files

### 4.1 [auth.js](frontend/src/stores/auth.js)

| Line | Italian | English |
|------|---------|---------|
| 16 | `// Salva token e user nel browser` | `// Save token and user in browser` |
| 24 | `'Login failed'` | `'Login failed'` (already English) |
| 49 | `// Opzionale: recupera profilo all'avvio` | `// Optional: fetch profile on startup` |
| 50 | `// ... implementeremo se serve` | `// ... will implement if needed` |

**Console log:**
- Line 23: `'Login failed'` → already English

---

### 4.2 [api.js](frontend/src/services/api.js)

| Line | Italian | English |
|------|---------|---------|
| 3 | `// Proxy gestito da Vite` | `// Proxy handled by Vite` |
| 9 | `// Interceptor per aggiungere il token automaticamente a ogni richiesta` | `// Interceptor to automatically add token to every request` |

---

## 5. Summary Statistics

### Total Translation Items by Category:

1. **Components:**
   - ConfirmDialog.vue: 3 items
   - Navbar.vue: 24 items
   - Footer.vue: 1 item
   - Grid.vue: 3 comments

2. **Views:**
   - UserBestScores.vue: 9 items
   - Login.vue: 8 items
   - Profile.vue: 16 items + 2 comments
   - Home.vue: 17 items
   - Leaderboard.vue: 15 items
   - Register.vue: 16 items
   - Users.vue: 7 items
   - Game.vue: 28 items + 18 comments + 11 console logs

### Common Translations (Multiple Occurrences):

- **Caricamento...** → **Loading...**
- **Registrati** → **Register**
- **Accedi** → **Login/Log In**
- **Classifiche** → **Leaderboards**
- **Tutorial** → **Tutorial** (keep)
- **Ranked** → **Ranked** (keep)
- **Errore** → **Error**
- **Record** → **Best Scores/Records**
- **Partite** → **Games/Matches**
- **Vittorie** → **Wins**
- **Tempo** → **Time**
- **Punteggio** → **Score**
- **Community** → **Community** (keep)

---

## 6. Next Steps - Files to Check

1. **JavaScript/TypeScript files:**
   - `/frontend/src/composables/useConfirm.js`
   - `/frontend/src/composables/useNotification.js`
   - `/frontend/src/stores/auth.js`
   - `/frontend/src/services/api.js`
   - `/frontend/src/main.js`
   - `/frontend/src/router.js`

2. **CSS files:**
   - `/frontend/src/styles/auth.css`
   - `/frontend/src/style.css`

3. **Other files:**
   - `/frontend/index.html`
   - `/frontend/package.json`

---

## 7. Implementation Recommendations

### Priority Levels:

**HIGH PRIORITY (User-Facing Text):**
- All button labels
- All form labels and placeholders
- All page titles and subtitles
- All error messages
- All notification messages
- All overlay text

**MEDIUM PRIORITY:**
- Alt text
- Title attributes
- Tooltips

**LOW PRIORITY:**
- Console logs (useful for debugging but not user-facing)
- Code comments (can remain in Italian for Italian developers)

### Implementation Strategy:

1. **Use i18n library** (e.g., vue-i18n) for proper internationalization
2. **Create translation files:**
   - `en.json` for English
   - `it.json` for Italian (current text)
3. **Replace hardcoded strings** with translation keys
4. **Add language switcher** in UI (optional)

---

*Document generated on: 2026-01-27*
*Total items identified: 150+ translation items*
