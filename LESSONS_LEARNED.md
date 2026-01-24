# 📚 HundredPath - Lessons Learned (Sessione 1)

Data: 23 Gennaio 2026

## 🎯 Obiettivo della Sessione

Imparare a costruire un **backend Node.js professionale** per un'applicazione full-stack, partendo da zero con approccio didattico step-by-step.

---

## ✅ Cosa Abbiamo Costruito

### Backend Foundation Completo

```
HundredPath/backend/
├── config/
│   └── database.js          # Connessione MongoDB
├── models/
│   ├── User.js              # Schema utenti + auth
│   ├── Game.js              # Schema partite
│   └── Leaderboard.js       # Schema classifica
├── tests/
│   └── test-models.js       # Test dei models
├── server.js                # Server Express
├── package.json             # Dipendenze e scripts
├── .env                     # Variabili ambiente
├── .gitignore               # File da escludere da Git
└── .env.example             # Template variabili
```

---

## 📖 Concetti Fondamentali Appresi

### 1. Node.js Basics

**Cos'è Node.js?**

- Runtime JavaScript lato server
- Basato su V8 (motore Chrome)
- Event-driven, non-blocking I/O
- Perfetto per API REST

**npm (Node Package Manager):**

- Gestore di pacchetti JavaScript
- `package.json` descrive il progetto
- `node_modules/` contiene le dipendenze
- `package-lock.json` blocca versioni esatte

**Scripts npm:**

```json
"scripts": {
  "start": "node server.js",      // Produzione
  "dev": "nodemon server.js"      // Development (auto-reload)
}
```

---

### 2. Express.js Framework

**Cos'è Express?**
Framework web minimalista per Node.js che semplifica:

- Routing HTTP
- Middleware
- Gestione richieste/risposte
- Error handling

**Middleware Chain:**

```
REQUEST → CORS → JSON Parser → Logger → Route Handler → RESPONSE
```

**Esempio pratico:**

```javascript
const express = require("express");
const app = express();

// Middleware
app.use(cors()); // Permette richieste cross-origin
app.use(express.json()); // Parse JSON nel body

// Route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
```

**Concetti chiave:**

- `app.use()` → Registra middleware globale
- `app.get/post/put/delete()` → Route HTTP
- `req` → Richiesta (query, params, body)
- `res` → Risposta (status, json, send)

---

### 3. MongoDB & Mongoose

**MongoDB (NoSQL Database):**

- Database a documenti (JSON-like)
- Flessibile (schema non rigido)
- Collection ≈ Tabelle SQL
- Document ≈ Righe SQL
- Ottimo per JavaScript (JSON nativo)

**Differenza SQL vs NoSQL:**

**SQL (relazionale):**

```sql
Table: users
| id | username | email |
|----|----------|-------|
| 1  | mario    | ...   |
```

**MongoDB (documenti):**

```javascript
Collection: users
{
  "_id": ObjectId("..."),
  "username": "mario",
  "email": "...",
  "stats": {              // ← Oggetti annidati!
    "gamesPlayed": 5
  }
}
```

**Mongoose (ODM):**

- Object Document Mapper
- Aggiunge "schema" a MongoDB
- Validazioni
- Middleware (hooks)
- Metodi custom

**Schema Mongoose:**

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
});
```

**Validazioni:**

- `required` → Campo obbligatorio
- `unique` → Valore unico in collection
- `minlength/maxlength` → Lunghezza stringa
- `min/max` → Range numeri
- `match` → Regex validation
- `enum` → Valori consentiti

---

### 4. Autenticazione & Sicurezza

**Password Hashing con bcrypt:**

❌ **MAI salvare password in chiaro!**

```javascript
{
  password: "password123";
} // ← PERICOLOSO!
```

✅ **Sempre hashare con bcrypt:**

```javascript
const bcrypt = require("bcryptjs");
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password, salt);
// Risultato: "$2a$10$N9qo8uLOickgx2ZMRZoMy..."
```

**Pre-save Hook (Middleware Mongoose):**

```javascript
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Confronto password al login:**

```javascript
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Uso:
const isMatch = await user.comparePassword("test");
```

---

### 5. Mongoose Avanzato

**ObjectId (Riferimenti):**

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'  // Come foreign key in SQL
}

// Poi puoi fare populate (simile a JOIN):
const game = await Game.findById(id).populate('userId');
console.log(game.userId.username);  // Accedi ai dati User!
```

**Array di Valori:**

```javascript
grid: {
  type: [Number],                    // Array di numeri
  default: () => Array(100).fill(null)  // Griglia 10x10
}
```

**Subdocuments (Array di Oggetti):**

```javascript
moves: [
  {
    number: Number,
    position: Number,
    timestamp: Date,
  },
];
```

**Metodi Custom:**

**Instance methods** (su un documento):

```javascript
userSchema.methods.comparePassword = async function (password) {
  // `this` = documento specifico
};

// Uso:
const user = await User.findById(id);
user.comparePassword("test");
```

**Static methods** (sulla collection):

```javascript
leaderboardSchema.statics.getTopPlayers = async function (limit) {
  // `this` = Model (collection intera)
  return this.find().sort({ moveCount: 1 }).limit(limit);
};

// Uso:
const top = await Leaderboard.getTopPlayers(100);
```

**Indici:**

```javascript
// Indice semplice
gameSchema.index({ userId: 1 });

// Indice composto (ordinamento)
leaderboardSchema.index({ moveCount: 1, timeElapsed: 1 });
```

**Timestamps automatici:**

```javascript
{
  timestamps: true; // Aggiunge createdAt e updatedAt
}
```

---

### 6. Denormalizzazione (NoSQL Pattern)

**Concetto:**
In SQL normalizzi (no duplicati). In NoSQL a volte **denormalizzi** per performance.

**Esempio Leaderboard:**

```javascript
{
  userId: ObjectId("..."),
  username: "mario",  // ← DUPLICATO dal model User!
  moveCount: 120
}
```

**Perché?**

- Query velocissime (no populate/JOIN)
- Leaderboard cambia raramente
- Performance > Normalizzazione

**Trade-off:**

- 👍 Query velocissime
- 👎 Se username cambia, devi aggiornare leaderboard

---

### 7. Environment Variables (.env)

**Perché usare .env?**

- Separare configurazione da codice
- Diversi settings per dev/production
- Proteggere secrets (non committare!)

**Esempio .env:**

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hundredpath
JWT_SECRET=my_super_secret_key
NODE_ENV=development
```

**Uso:**

```javascript
require("dotenv").config();
const port = process.env.PORT;
```

**IMPORTANTE:**

- ✅ `.env` in `.gitignore`
- ✅ Crea `.env.example` (template senza secrets)
- ❌ Mai committare `.env` su GitHub!

---

### 8. Docker per MongoDB

**Perché Docker?**

- Setup velocissimo (1 comando)
- Non "sporca" il sistema
- Facile da resettare
- Identico a produzione

**Comando usato:**

```bash
sudo docker run -d \
  --name mongodb-hundredpath \
  -p 27017:27017 \
  -v mongodb-data:/data/db \
  mongo:latest
```

**Spiegazione:**

- `-d` → Background
- `--name` → Nome container
- `-p 27017:27017` → Mappa porta
- `-v mongodb-data:/data/db` → Persiste dati
- `mongo:latest` → Immagine MongoDB

---

### 9. Testing & Best Practices

**Struttura Test:**

```javascript
async function testModels() {
  try {
    // 1. Setup (connessione DB)
    await mongoose.connect(URI);

    // 2. Cleanup dati vecchi
    await User.deleteMany({ username: 'test' });

    // 3. Test
    const user = new User({ username: 'test', ... });
    await user.save();
    assert(user._id);  // Verifica

    // 4. Cleanup finale
    await User.deleteMany({ username: 'test' });
  } finally {
    await mongoose.connection.close();
  }
}
```

**Best Practices apprese:**

- ✅ Separare test in cartella `tests/`
- ✅ Cleanup prima E dopo i test
- ✅ Usare dati realistici
- ✅ Testare validazioni
- ✅ Testare metodi custom

---

### 10. Async/Await & Promises

**Pattern moderno JavaScript:**

**Vecchio (callback hell):**

```javascript
User.findById(id, function (err, user) {
  if (err) return handleError(err);
  Game.find({ userId: user._id }, function (err, games) {
    // ... 😱
  });
});
```

**Moderno (async/await):**

```javascript
async function getUser() {
  const user = await User.findById(id);
  const games = await Game.find({ userId: user._id });
  return { user, games };
}
```

**Regole:**

- `async function` → Può usare `await`
- `await` → Aspetta che la Promise si risolva
- Errori → Usa `try/catch`

**Mongoose 6+ Hook Pattern:**

```javascript
// ✅ CORRETTO (Mongoose 6+)
userSchema.pre("save", async function () {
  // No next() con async!
  await doSomething();
});

// ❌ VECCHIO (Mongoose 5)
userSchema.pre("save", function (next) {
  doSomething();
  next();
});
```

---

## 🛠️ Tools & Tecnologie Usate

| Tool         | Scopo                      | Versione |
| ------------ | -------------------------- | -------- |
| Node.js      | Runtime JavaScript         | v25+     |
| Express      | Framework web              | v5+      |
| MongoDB      | Database NoSQL             | latest   |
| Mongoose     | ODM per MongoDB            | v9+      |
| bcryptjs     | Password hashing           | v3+      |
| jsonwebtoken | JWT auth                   | v9+      |
| cors         | Cross-origin requests      | v2+      |
| dotenv       | Environment variables      | v17+     |
| nodemon      | Auto-reload dev server     | v3+      |
| Docker       | Containerizzazione MongoDB | latest   |

---

## 💡 Problemi Risolti & Debugging

### 1. Errore: `next is not a function`

**Causa:** Mongoose 6+ con async/await non usa `next()`  
**Soluzione:** Rimuovere `next()` dalle funzioni async

### 2. Errore: `E11000 duplicate key`

**Causa:** Dati test rimasti da esecuzione precedente  
**Soluzione:** Cleanup all'inizio del test

### 3. Errore: `Cannot find module './models/User'`

**Causa:** Path relativo sbagliato da `tests/` subdirectory  
**Soluzione:** Usare `../models/User` invece di `./models/User`

### 4. Errore: `moveCount (2) is less than minimum allowed value (99)`

**Causa:** Validazione `min: 99` nel model Leaderboard  
**Soluzione:** Usare dati test realistici (120 mosse)

---

## 📊 Struttura Dati Finale

### User Schema

```javascript
{
  username: String (unique, 3-20 chars),
  email: String (unique, valid email),
  password: String (hashed, min 6),
  stats: {
    gamesPlayed: Number,
    gamesCompleted: Number,
    bestMoves: Number,
    totalTime: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Game Schema

```javascript
{
  userId: ObjectId (ref User),
  grid: [Number] (100 elementi),
  currentNumber: Number (1-101),
  moves: [{
    number: Number,
    position: Number,
    timestamp: Date
  }],
  moveCount: Number,
  status: 'in_progress' | 'completed' | 'abandoned',
  startedAt: Date,
  completedAt: Date,
  timeElapsed: Number (secondi)
}
```

### Leaderboard Schema

```javascript
{
  userId: ObjectId (ref User),
  gameId: ObjectId (ref Game, unique),
  username: String (denormalized),
  moveCount: Number (min 99),
  timeElapsed: Number,
  completedAt: Date
}
```

---

## 🚀 Prossimi Passi

### Fase 2: API Routes (Da Fare)

1. **Authentication Routes** (`/api/auth`)
   - POST `/register` - Registrazione
   - POST `/login` - Login con JWT
   - GET `/me` - Profilo utente (protected)

2. **Game Routes** (`/api/games`)
   - POST `/` - Nuova partita
   - GET `/:id` - Dettagli partita
   - PUT `/:id/move` - Piazza numero
   - PUT `/:id/undo` - Undo mossa
   - POST `/:id/complete` - Completa partita

3. **Leaderboard Routes** (`/api/leaderboard`)
   - GET `/` - Top 100 giocatori
   - GET `/user/:userId` - Posizione utente

4. **Stats Routes** (`/api/stats`)
   - GET `/user/:userId` - Statistiche

### Concetti da Imparare:

- **JWT (JSON Web Tokens)** - Autenticazione stateless
- **Middleware di autenticazione** - Proteggere route
- **Express Router** - Organizzare routes
- **Validazione input** - express-validator
- **Error handling** - Gestione errori centralizzata
- **Logica di business** - Validazione mosse gioco

---

## 🎓 Key Takeaways

1. **Node.js è potente** per backend JavaScript
2. **Express semplifica** la creazione di API
3. **MongoDB + Mongoose** offre flessibilità con structure
4. **Bcrypt è essenziale** per sicurezza password
5. **Docker facilita** setup database
6. **Testing è importante** per verificare funzionalità
7. **Async/await** rende codice più leggibile
8. **Environment variables** separano config da code

---

## 📚 Risorse per Approfondire

- [Node.js Official Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University](https://university.mongodb.com/) - Corsi gratuiti
- [bcrypt Explained](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)

---

## 🏆 Conclusione

In questa sessione hai costruito **da zero un backend Node.js professionale** con:

- Server Express configurato
- Database MongoDB connesso
- 3 Models con validazioni e metodi custom
- Sistema di test funzionante
- Best practices di sicurezza

**Sei pronto per la Fase 2: API Routes!** 🚀

---

_Prossima sessione: Implementare autenticazione JWT e API REST complete_
