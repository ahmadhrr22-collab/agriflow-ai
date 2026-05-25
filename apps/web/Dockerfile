# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package.json ./

# Install dependencies with npm
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Bake API URLs into the Next.js build
ENV NEXT_PUBLIC_API_URL=https://agriflow-api-694788844994.asia-southeast1.run.app/api/v1
ENV NEXT_PUBLIC_AI_URL=https://agriflow-ai-694788844994.asia-southeast1.run.app/api/v1

# Build the Next.js app
RUN npm run build

# ---- Stage 2: Runner ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
