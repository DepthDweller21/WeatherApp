FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN bun install

# Copy source files
COPY src ./src

# Start the worker
CMD ["bun", "src/index.ts"]
