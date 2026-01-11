FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Copy source files
COPY src ./src

# Start the producer
CMD ["bun", "src/index.ts"]
