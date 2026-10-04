FROM node:20-alpine AS build

WORKDIR /app

# Copy root package files
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN npm --prefix client install
RUN npm --prefix server install

# Copy source code
COPY client ./client
COPY server ./server

# Build frontend and backend
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/package.json ./server/

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
