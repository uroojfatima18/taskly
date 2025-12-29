FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NEXT_PUBLIC_API_URL=https://uroojfatima22-deploy-taskly.hf.space

RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 7860

ENV PORT=7860
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
