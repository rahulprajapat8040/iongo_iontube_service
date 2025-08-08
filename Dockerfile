# ********* BASE STAGE *********
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# ********* BUILD STAGE ********
FROM base AS builder
COPY . .
RUN npm run build

# ******** PRODUCATION STAGE *********
FROM node:20-alpine AS producation 
WORKDIR /app

# Install only production dependencies + ffmpeg
RUN apt-get update && apt-get install -y ffmpeg \
    && npm install --only=production --frozen-lockfile


# COPY node_modules and dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# EXPOSE PORT
EXPOSE 4000

# RUN APP
CMD [ "node", "dist/main" ]