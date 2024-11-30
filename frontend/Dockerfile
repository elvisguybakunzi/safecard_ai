# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy only the necessary files for dependency installation
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project to the container
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the application
FROM node:18-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
