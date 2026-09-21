FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json tailwind.config.js postcss.config.js next.config.js ./
COPY public/ ./public/
COPY src/ ./src/

ENV NEXT_PUBLIC_INGESTION_WS_URL=http://localhost:3002
ENV NEXT_PUBLIC_AI_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_SIMULATOR_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_WELL_ID=BW-001

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
