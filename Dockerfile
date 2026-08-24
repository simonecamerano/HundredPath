# Un solo container serve sia le pagine sia l'API, sullo stesso dominio:
# nessun servizio esterno consegna il sito agli utenti e non serve CORS.
# Richiede Base Directory "/" sulla risorsa Coolify, non "/backend".

# Fase 1: compila il frontend
FROM node:22-alpine AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Fase 2: il backend, con il frontend compilato dentro public/
FROM node:22-alpine
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend /build/dist ./public

EXPOSE 3000
CMD ["npm", "start"]
