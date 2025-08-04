# --------- BASE STAGE -----------
FROM node:20-alphine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

# --------- BUILD STAGE --------
FROM base as builder
COPY . .
RUN npm run build

# COPY THAT NEED
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY .env .env

# EXPOSE PORT
EXPOSE 3000
EXPOSE 3001
CMD [ "node", "dist/main" ]