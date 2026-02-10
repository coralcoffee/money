# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package*.json ./

# Install dependencies (including devDependencies for build process)
RUN npm ci --silent && npm cache clean --force

# Copy source code
COPY . .

# Build the application with RSBuild
RUN npm run build

# Production stage
FROM nginx:1.27.2-alpine

# Install dumb-init and curl for proper signal handling and health checks
RUN apk add --no-cache dumb-init curl

# Create app user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# Copy built assets from build stage (RSBuild typically outputs to 'dist')
COPY --from=build --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Create nginx pid directory and set permissions
RUN mkdir -p /var/run/nginx && \
    chown -R appuser:appgroup /var/run/nginx && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Use non-root user
USER appuser

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Expose port (using 8080 for non-root user)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]