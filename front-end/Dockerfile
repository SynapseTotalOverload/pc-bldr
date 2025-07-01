FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* .env ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./

# Only copy .env if it exists (won't fail if missing)
EXPOSE 3000
CMD ["npm", "start"]
