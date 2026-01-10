# Use the official Bun image (as the runtime for Next.js)
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and bun.lockb for Bun's dependency installation
COPY package.json ./

# Install Bun dependencies
RUN bun install

# Copy the rest of the Next.js app files into the container
COPY . .

# Expose the port for the Next.js app to run on
EXPOSE 3000

# Start the Next.js app with Bun (for development)
CMD ["bun", "dev"]
