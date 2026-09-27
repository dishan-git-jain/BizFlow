# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies manifest
COPY package*.json ./
RUN npm ci

# Copy full application source code
COPY . .

# Build production bundle
RUN npm run build

# Stage 2: Serve Full-Stack Express REST API + Production Static Frontend
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production dependencies & built bundle
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/src/data ./src/data

# Expose default Cloud Run port
EXPOSE 8080

# Environment variable for PORT
ENV PORT=8080
ENV NODE_ENV=production

# Start Full-Stack Express REST API Server
CMD ["node", "server/index.js"]
