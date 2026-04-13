FROM node:22-alpine

WORKDIR /app

# Copiamo i file dei pacchetti
COPY package*.json ./

# Installiamo tutte le dipendenze (anche quelle di build se necessarie)
RUN npm install

# Copiamo il resto del codice
COPY . .

# IMPORTANTE: Cambia 3000 con la porta che usa il tuo backend 
# (controlla nel tuo file server.js o index.js, es. app.listen(PORT))
EXPOSE 3000

CMD ["npm", "start"]
