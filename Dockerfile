# Multi-stage Dockerfile for NestJS with Oracle Instant Client
# ===========================================
# Stage 1: Builder - Only for building the app
# ===========================================
FROM node:24-alpine AS builder

# Set NODE_OPTIONS globally to suppress deprecation warnings
ENV NODE_OPTIONS="--no-deprecation"

# Install build dependencies only in builder stage
RUN apk add --no-cache python3 make g++ libaio libc6-compat

# Create Oracle directory
RUN mkdir -p /opt/oracle

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Copy Oracle Instant Client ZIP files
COPY oracle-instant-client/*.zip /opt/oracle/

# Install Oracle Instant Client optimized
WORKDIR /opt/oracle
RUN unzip -o -q instantclient-basic-linux.x64-21.18.0.0.0dbru.zip && \
    unzip -o -q instantclient-sdk-linux.x64-21.18.0.0.0dbru.zip && \
    rm -f *.zip && \
    # Remove unnecessary files to reduce size
    rm -rf /opt/oracle/instantclient_21_18/sdk/demo && \
    rm -rf /opt/oracle/instantclient_21_18/*.jar && \
    find /opt/oracle/instantclient_21_18 -name "*.so.*" -not -name "libclntsh.so.21.1" -not -name "libclntshcore.so.21.1" -not -name "libons.so" -delete && \
    rm -f /opt/oracle/instantclient && \
    ln -s /opt/oracle/instantclient_21_18 /opt/oracle/instantclient && \
    rm -f /opt/oracle/instantclient/libclntsh.so && \
    ln -s /opt/oracle/instantclient/libclntsh.so.21.1 /opt/oracle/instantclient/libclntsh.so

# Set Oracle environment variables
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INC_DIR="/opt/oracle/instantclient/sdk/include"

WORKDIR /app

# Install ALL dependencies (including devDependencies for building)
RUN yarn install && \
    yarn cache clean --all

# Copy source code
COPY . .

# Build the application
RUN yarn build && \
    ls -la dist/ && ls -la dist/src/

# ===========================================
# Stage 2: Dependencies - Install production dependencies
# ===========================================
FROM node:24-alpine AS dependencies

# Set NODE_OPTIONS globally to suppress deprecation warnings
ENV NODE_OPTIONS="--no-deprecation"

# Install only runtime dependencies (no build tools)
RUN apk add --no-cache libaio libc6-compat && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* ./

# Install ONLY production dependencies
RUN yarn install --production && \
    yarn cache clean --all && \
    rm -rf /tmp/* && \
    rm -rf ~/.yarn

# ===========================================
# Stage 3: Production - Minimal runtime image
# ===========================================
FROM node:24-alpine AS production

# Set NODE_OPTIONS globally to suppress deprecation warnings
ENV NODE_OPTIONS="--no-deprecation"

# Install only runtime dependencies (no build tools)
RUN apk add --no-cache libaio libc6-compat && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy production dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json

# Copy optimized Oracle Instant Client from builder
COPY --from=builder /opt/oracle/instantclient /opt/oracle/instantclient

# Set Oracle environment variables
ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INC_DIR="/opt/oracle/instantclient/sdk/include"

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Verify the dist folder exists and contains main.js
RUN ls -la dist/ && ls -la dist/src/ && test -f dist/src/main.js

# Set build version
ARG BUILD_NUMBER=1
RUN yarn version --new-version "v0.0.${BUILD_NUMBER}" --no-git-tag-version

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership to nestjs user
RUN chown -R nestjs:nodejs /app /opt/oracle

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Start in production mode
CMD ["sh", "-c", "printf '========================================\\n🏭 Starting in PRODUCTION mode\n========================================\\n' && yarn start:prod"]