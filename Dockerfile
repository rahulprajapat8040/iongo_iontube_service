# ********* BASE STAGE *********
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# ********* BUILD STAGE *********
FROM base AS builder
COPY . .
RUN npm run build

# ********* PRODUCTION STAGE *********
FROM node:20-alpine AS production
WORKDIR /app

# Install ffmpeg for Alpine
RUN apk add --no-cache ffmpeg

# Copy only production dependencies
COPY package*.json ./
RUN npm install --only=production --frozen-lockfile

# Copy node_modules and dist from earlier stages
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# Expose port
EXPOSE 4000

# Run app
CMD ["node", "dist/main"]
