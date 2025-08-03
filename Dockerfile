# Multi-stage build for Student Management System
FROM node:18-alpine as client-build

# Set working directory for client build
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install client dependencies
RUN npm ci --only=production

# Copy client source code
COPY client/ ./

# Build client for production
RUN npm run build

# Production stage
FROM node:18-alpine as production

# Create app directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache postgresql-client

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sms -u 1001

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy server source code
COPY server/ ./

# Copy built client from previous stage
COPY --from=client-build /app/client/build ./public

# Change ownership to non-root user
RUN chown -R sms:nodejs /app
USER sms

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]